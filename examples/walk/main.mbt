///|
/// 递归遍历一块 NTFS 镜像，打印整棵目录树。
///
/// 这是库 API 的最小完整用法：读镜像 → 定位卷 → 打开 MFT → 列目录 →
/// 列命名流。全程不经过 CLI 的路径解析，三个后端跑的是同一份代码。
///
///   moon run examples/walk -- testdata/synth-ntfs.img
///
/// 示例刻意不跟随重解析点。链接的目标可能根本不在镜像里，跟过去等于
/// 凭空造出一条镜像中并不存在的路径；能读到的是链接本身——tag 与目标
/// 字符串，原样打印出来。

///|
/// 递归深度上限。
///
/// 不跟随链接已经挡住了大多数环，但目录联接仍可能指回祖先。用上限兜底，
/// 比相信"镜像里不会有环"可靠。
const MAX_DEPTH : Int32 = 32

///|
fn try_volume(img : @block.Image, lba : Int64) -> @ntfs.Volume? {
  let vol = @ntfs.Volume::open(img, lba) catch { _ => return None }
  Some(vol)
}

///|
/// 在镜像里找 NTFS 卷：先按分区表走，找不到再当裸卷试。
///
/// 两种形态都常见——整盘镜像带分区表，`dd` 出来的分区镜像是裸卷。同一个
/// `Volume::open` 两条路都能开，区别只是起始扇区。
fn find_volume(img : @block.Image) -> @ntfs.Volume? {
  let parts = @partition.read(img) catch { _ => [] }
  for part in parts {
    match try_volume(img, part.start_lba) {
      Some(vol) => return Some(vol)
      None => ()
    }
  }
  try_volume(img, 0L)
}

///|
/// 打印一个文件的摘要：大小、标志、命名流。
fn describe_file(
  img : @block.Image,
  vol : @ntfs.Volume,
  mft : @ntfs.Mft,
  entry : @ntfs.DirEntry,
  path : String,
) -> Unit {
  let mut marks = ""
  // 0x800 = COMPRESSED，0x4000 = ENCRYPTED，都是 $FILE_NAME 的标志位
  if (entry.flags & 0x00000800L) != 0L {
    marks = marks + " compressed"
  }
  if (entry.flags & 0x00004000L) != 0L {
    marks = marks + " encrypted"
  }
  let reparse = @ntfs.reparse_of(img, vol, mft, entry.record_number) catch {
    _ => None
  }
  match reparse {
    Some(rp) =>
      marks = marks + " " + rp.kind + " -> " + rp.print_name + " (not followed)"
    None => ()
  }
  println(path + "  " + entry.logical_size.to_string() + " B" + marks)
  // 命名数据流与默认流平级，都读一遍才不会漏字节
  let streams = @ntfs.list_streams(img, vol, mft, entry.record_number) catch {
    _ => []
  }
  for stream in streams {
    println("    :" + stream.name + "  " + stream.size.to_string() + " B")
  }
}

///|
fn walk(
  img : @block.Image,
  vol : @ntfs.Volume,
  mft : @ntfs.Mft,
  record : Int64,
  prefix : String,
  depth : Int32,
) -> Unit raise @ntfs.NtfsError {
  if depth > MAX_DEPTH {
    println(prefix + "  ... (depth limit)")
    return
  }
  let entries = @ntfs.list_directory(img, vol, mft, record)
  for entry in entries {
    // `.` 与 `..` 是真实存在的索引项，打印出来只是噪声
    if entry.name == "." || entry.name == ".." {
      continue
    }
    let path = prefix + "/" + entry.name
    if entry.is_directory() {
      println(path + "/")
      walk(img, vol, mft, entry.record_number, path, depth + 1)
    } else {
      describe_file(img, vol, mft, entry, path)
    }
  }
}

///|
fn main {
  let args = @env.args()
  // 各后端对 argv 的处理不同：js 会把解释器与脚本路径都带进来，wasm-gc
  // 只有一个程序名。镜像路径固定是最后一个参数。
  if args.length() < 2 {
    println("usage: moon run examples/walk -- <image>")
    return
  }
  let path = args[args.length() - 1]
  let bytes = @fs.read_file_to_bytes(path) catch {
    _ => {
      println("cannot read " + path)
      println("usage: moon run examples/walk -- <image>")
      return
    }
  }
  let img = @block.Image::from_bytes(bytes) catch {
    err => {
      println("bad image: " + @block.reason_of(err))
      return
    }
  }
  let vol = match find_volume(img) {
    Some(v) => v
    None => {
      println("no NTFS volume found in " + path)
      return
    }
  }
  let mft = @ntfs.Mft::open(img, vol) catch {
    err => {
      println("cannot open MFT: " + @ntfs.describe_error(err))
      return
    }
  }
  println(
    "/  (" +
    (vol.size() / 1024L).to_string() +
    " KiB, cluster " +
    vol.cluster_size.to_string() +
    " B)",
  )
  walk(img, vol, mft, 5L, "", 0) catch {
    err => println("walk stopped: " + @ntfs.describe_error(err))
  }
}
