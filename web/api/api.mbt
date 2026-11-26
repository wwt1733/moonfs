// 浏览器侧的三个入口。
//
// 这里不碰 DOM，也不读文件：JS 把 `Uint8Array` 递进来，这里返回一段 JSON，
// 由页面去渲染。保持无状态——每次调用都从字节重新解析，页面因此不会和
// 解析器持有的中间状态产生分歧。

///|
/// 把函数挂到 `globalThis` 上，页面直接调用。
extern "js" fn expose_describe(f : (Bytes) -> String) -> Unit = "(f) => { globalThis.moonfsDescribe = f }"

///|
extern "js" fn expose_list(f : (Bytes, Int32, String) -> String) -> Unit = "(f) => { globalThis.moonfsList = f }"

///|
extern "js" fn expose_read(f : (Bytes, Int32, String, Int32) -> String) -> Unit = "(f) => { globalThis.moonfsRead = f }"

///|
fn main {
  expose_describe(describe)
  expose_list(list)
  expose_read(read)
}

///|
/// 检测到的一个卷。
enum Fs {
  Ntfs(@ntfs.Volume)
  Ext4(@ext4.Superblock)
}

///|
struct Found {
  /// 卷在镜像里的起始 LBA，裸卷是 0。
  start_lba : Int64
  fs : Fs
}

// ---------------------------------------------------------------------------
// 出口
// ---------------------------------------------------------------------------

///|
/// 探测镜像：裸卷优先，否则读分区表逐个试。返回卷列表与每个卷的根目录。
fn describe(data : Bytes) -> String {
  let img = @block.Image::from_bytes(data) catch {
    _ =>
      return err_json(
        "无法把这个文件当成磁盘镜像：长度或扇区大小不合法",
      )
  }
  let found = find_volumes(img)
  if found.is_empty() {
    return err_json(
      "没有找到 NTFS 或 ext4 卷。支持裸卷与 MBR / GPT 分区表镜像。",
    )
  }
  let mut out = "{\"ok\":true,\"size\":" +
    img.size().to_string() +
    ",\"volumes\":["
  for i, f in found {
    if i > 0 {
      out = out + ","
    }
    out = out +
      "{\"i\":" +
      i.to_string() +
      ",\"start\":" +
      f.start_lba.to_string() +
      ",\"fs\":" +
      quote(fs_name(f.fs)) +
      ",\"label\":" +
      quote(fs_label(f.fs)) +
      ",\"root\":" +
      list_json(img, f.fs, "/") +
      "}"
  }
  out + "]}"
}

///|
/// 列出某个目录。`path` 用 `/` 分隔，根目录传 `/`。
fn list(data : Bytes, volume : Int32, path : String) -> String {
  let img = @block.Image::from_bytes(data) catch {
    _ => return err_json("镜像不合法")
  }
  let found = find_volumes(img)
  let f = match nth(found, volume) {
    None => return err_json("卷序号越界")
    Some(f) => f
  }
  "{\"ok\":true,\"path\":" +
  quote(path) +
  ",\"entries\":" +
  list_json(img, f.fs, path) +
  "}"
}

///|
/// 读一个文件的头部 `max` 字节。文本原样给，二进制给十六进制。
fn read(data : Bytes, volume : Int32, path : String, max : Int32) -> String {
  let img = @block.Image::from_bytes(data) catch {
    _ => return err_json("镜像不合法")
  }
  let found = find_volumes(img)
  let f = match nth(found, volume) {
    None => return err_json("卷序号越界")
    Some(f) => f
  }
  let cap = if max <= 0 { 4096 } else if max > 65536 { 65536 } else { max }
  let body = match read_path(img, f.fs, path) {
    Ok(body) => body
    Err(msg) => return err_json(msg)
  }
  let total = body.length()
  let shown = if total > cap { cap } else { total }
  let head = @binio.slice(body, 0, shown) catch { _ => body }
  let payload = if looks_text(head) {
    ("text", quote(@utf8.decode_lossy(head)))
  } else {
    ("binary", quote(hex(head)))
  }
  "{\"ok\":true,\"size\":" +
  total.to_string() +
  ",\"shown\":" +
  shown.to_string() +
  ",\"kind\":\"" +
  payload.0 +
  "\",\"data\":" +
  payload.1 +
  "}"
}

// ---------------------------------------------------------------------------
// 探测
// ---------------------------------------------------------------------------

///|
fn find_volumes(img : @block.Image) -> Array[Found] {
  let out : Array[Found] = []
  // 裸卷：引导扇区直接在偏移 0。命中就不再看分区表——否则会拿卷头当 MBR 读。
  match detect(img, 0L) {
    Some(fs) => {
      out.push({ start_lba: 0L, fs, })
      return out
    }
    None => ()
  }
  match try_partitions(img) {
    None => ()
    Some(parts) =>
      for p in parts {
        match detect(img, p.start_lba) {
          Some(fs) => out.push({ start_lba: p.start_lba, fs, })
          None => ()
        }
      }
  }
  out
}

///|
fn detect(img : @block.Image, start_lba : Int64) -> Fs? {
  match try_ntfs(img, start_lba) {
    Some(vol) => Some(Fs::Ntfs(vol))
    None =>
      match try_ext4(img, start_lba) {
        Some(sb) => Some(Fs::Ext4(sb))
        None => None
      }
  }
}

///|
fn try_ntfs(img : @block.Image, start_lba : Int64) -> @ntfs.Volume? {
  let vol = @ntfs.Volume::open(img, start_lba) catch { _ => return None }
  Some(vol)
}

///|
fn try_ext4(img : @block.Image, start_lba : Int64) -> @ext4.Superblock? {
  let sb = @ext4.Superblock::open(img, start_lba) catch { _ => return None }
  Some(sb)
}

///|
fn try_partitions(img : @block.Image) -> Array[@partition.Partition]? {
  let parts = @partition.read(img) catch { _ => return None }
  Some(parts)
}

// ---------------------------------------------------------------------------
// 列目录 / 读文件
// ---------------------------------------------------------------------------

///|
fn list_json(img : @block.Image, fs : Fs, path : String) -> String {
  match fs {
    Ntfs(vol) => ntfs_list_json(img, vol, path)
    Ext4(sb) => ext4_list_json(img, sb, path)
  }
}

///|
fn ntfs_list_json(
  img : @block.Image,
  vol : @ntfs.Volume,
  path : String,
) -> String {
  let mft = @ntfs.Mft::open(img, vol) catch { _ => return "[]" }
  let number = match ntfs_resolve(img, vol, mft, path) {
    Some(n) => n
    None => return "[]"
  }
  let entries = @ntfs.list_directory(img, vol, mft, number) catch {
    _ => return "[]"
  }
  let mut out = "["
  for i, e in entries {
    if i > 0 {
      out = out + ","
    }
    out = out +
      "{\"n\":" +
      quote(e.name) +
      ",\"s\":" +
      e.logical_size.to_string() +
      ",\"d\":" +
      e.is_directory().to_string() +
      "}"
  }
  out + "]"
}

///|
/// 按路径找到 NTFS 记录号；根目录固定是 5。
fn ntfs_resolve(
  img : @block.Image,
  vol : @ntfs.Volume,
  mft : @ntfs.Mft,
  path : String,
) -> Int64? {
  let mut current = 5L
  for seg in split_path(path) {
    let entries = @ntfs.list_directory(img, vol, mft, current) catch {
      _ => return None
    }
    let mut next : Int64? = None
    for e in entries {
      if e.name == seg {
        next = Some(e.record_number)
      }
    }
    match next {
      None => return None
      Some(n) => current = n
    }
  }
  Some(current)
}

///|
fn ext4_list_json(
  img : @block.Image,
  sb : @ext4.Superblock,
  path : String,
) -> String {
  let dir = ext4_resolve(img, sb, path) catch { _ => return "[]" }
  let entries = @ext4.list_directory(img, sb, dir) catch { _ => return "[]" }
  let mut out = "["
  let mut first = true
  for e in entries {
    if e.name == "." || e.name == ".." {
      continue
    }
    // 目录项只带 inode 号与类型，大小要再去读一次 inode
    let size = ext4_size_of(img, sb, e.inode)
    if !first {
      out = out + ","
    }
    first = false
    out = out +
      "{\"n\":" +
      quote(e.name) +
      ",\"s\":" +
      size.to_string() +
      ",\"d\":" +
      e.is_directory().to_string() +
      "}"
  }
  out + "]"
}

///|
fn ext4_size_of(
  img : @block.Image,
  sb : @ext4.Superblock,
  inode : Int64,
) -> Int64 {
  let parsed = @ext4.read_inode(img, sb, inode) catch { _ => return 0L }
  parsed.size
}

///|
fn ext4_resolve(
  img : @block.Image,
  sb : @ext4.Superblock,
  path : String,
) -> @ext4.Inode raise @ext4.Ext4Error {
  let clean = split_path(path)
  if clean.is_empty() {
    // 根目录固定是 inode 2
    return @ext4.read_inode(img, sb, 2L)
  }
  @ext4.resolve_path(img, sb, path)
}

///|
fn read_path(
  img : @block.Image,
  fs : Fs,
  path : String,
) -> Result[Bytes, String] {
  match fs {
    Ntfs(vol) => {
      let mft = @ntfs.Mft::open(img, vol) catch {
        err => return Err(@ntfs.describe_error(err))
      }
      let number = match ntfs_resolve(img, vol, mft, path) {
        Some(n) => n
        None => return Err("路径不存在：" + path)
      }
      let body = @ntfs.read_file(img, vol, mft, number) catch {
        err => return Err(@ntfs.describe_error(err))
      }
      Ok(body)
    }
    Ext4(sb) => {
      let inode = ext4_resolve(img, sb, path) catch {
        _ => return Err("路径不存在：" + path)
      }
      let body = @ext4.read_inode_data(img, sb, inode) catch {
        err => return Err(@ext4.describe_error(err))
      }
      Ok(body)
    }
  }
}

// ---------------------------------------------------------------------------
// 小工具
// ---------------------------------------------------------------------------

///|
fn nth(found : Array[Found], i : Int32) -> Found? {
  if i < 0 || i >= found.length() {
    return None
  }
  Some(found[i])
}

///|
fn split_path(path : String) -> Array[String] {
  let out : Array[String] = []
  for seg in path.split("/") {
    let s = seg.to_owned()
    if s != "" && s != "." {
      out.push(s)
    }
  }
  out
}

///|
fn fs_name(fs : Fs) -> String {
  match fs {
    Ntfs(_) => "ntfs"
    Ext4(_) => "ext4"
  }
}

///|
fn fs_label(fs : Fs) -> String {
  match fs {
    Ntfs(vol) =>
      "NTFS · cluster " +
      vol.cluster_size.to_string() +
      " B · " +
      (vol.total_sectors * vol.bytes_per_sector.to_int64()).to_string() +
      " B"
    Ext4(sb) =>
      "ext4 · block " +
      sb.block_size.to_string() +
      " B · " +
      sb.blocks_count.to_string() +
      " 块"
  }
}

///|
fn err_json(msg : String) -> String {
  "{\"ok\":false,\"error\":" + quote(msg) + "}"
}

///|
fn quote(s : String) -> String {
  let a = s.replace_all(old="\\", new="\\\\")
  let b = a.replace_all(old="\"", new="\\\"")
  let c = b.replace_all(old="\n", new="\\n")
  let d = c.replace_all(old="\r", new="\\r")
  let e = d.replace_all(old="\t", new="\\t")
  "\"" + e + "\""
}

///|
/// 二进制还是文本：出现 NUL 一律算二进制，控制字符超过 5% 也算。
fn looks_text(data : Bytes) -> Bool {
  let n = data.length()
  if n == 0 {
    return true
  }
  let mut bad = 0
  for b in data {
    let v = b.to_int()
    if v == 0 {
      return false
    }
    if v < 0x09 || (v > 0x0D && v < 0x20) {
      bad = bad + 1
    }
  }
  bad * 20 <= n
}

///|
fn hex(data : Bytes) -> String {
  let buf = StringBuilder()
  for b in data {
    buf.write_string(b.to_hex())
  }
  buf.to_string()
}
