///|
/// 目录里的一个条目。
pub(all) struct DirEntry {
  inode : Int64
  name : String
  /// 目录项里的 `file_type`：1 普通文件、2 目录、7 符号链接，0 表示未知。
  file_type : Int32
}

///|
/// 目录项的 `file_type` 取值。
const FT_DIR : Int32 = 2

///|
pub fn DirEntry::is_directory(self : DirEntry) -> Bool {
  self.file_type == FT_DIR
}

///|
/// 列出一个目录 inode 的条目。
pub fn list_directory(
  img : @block.Image,
  sb : Superblock,
  inode : Inode,
) -> Array[DirEntry] raise Ext4Error {
  if !inode.is_directory() {
    raise Corrupt(
      reason="inode " + inode.number.to_string() + " is not a directory",
    )
  }
  let data = read_inode_data(img, sb, inode)
  parse_dir_entries(data, sb)
}

///|
/// 解析一段目录内容。
///
/// 目录项是一条条紧挨着的记录，靠 `rec_len` 串起来——不是定长数组。
/// 删除文件时只会改前一条的 `rec_len` 把空间并进去，所以整段里既有
/// 有效项也有被吞掉的空隙，必须按 `rec_len` 走而不是按固定步长。
pub fn parse_dir_entries(
  data : Bytes,
  sb : Superblock,
) -> Array[DirEntry] raise Ext4Error {
  // 没有 FILETYPE 特性时，0x06 处的 2 字节是名字长度，没有文件类型字节
  let has_file_type = (sb.feature_incompat & INCOMPAT_FILETYPE) != 0L
  let out : Array[DirEntry] = []
  let total = data.length()
  let mut pos = 0
  while pos + 8 <= total {
    let inode_no = @binio.u32le(data, pos) catch { _ => 0L }
    let rec_len = @binio.u16le(data, pos + 4) catch { _ => 0L }
    if rec_len < 8L || (rec_len & 3L) != 0L {
      raise Corrupt(
        reason="directory entry at " +
          pos.to_string() +
          " has rec_len " +
          rec_len.to_string(),
      )
    }
    if pos + rec_len.to_int() > total {
      raise Corrupt(
        reason="directory entry at " + pos.to_string() + " runs past its block",
      )
    }
    let name_len = if has_file_type {
      @binio.u8(data, pos + 6) catch {
        _ => 0L
      }
    } else {
      @binio.u16le(data, pos + 6) catch {
        _ => 0L
      }
    }
    let file_type = if has_file_type {
      (@binio.u8(data, pos + 7) catch { _ => 0L }).to_int()
    } else {
      0
    }
    // inode 为 0 是被删除后留下的空洞，名字长度为 0 是填充
    if inode_no != 0L && name_len > 0L && name_len <= 255L {
      let name_end = pos + 8 + name_len.to_int()
      if name_end <= pos + rec_len.to_int() {
        let name_bytes = @binio.slice(data, pos + 8, name_len.to_int()) catch {
          _ => Bytes::new(0)
        }
        out.push({
          inode: inode_no,
          name: @utf8.decode_lossy(name_bytes),
          file_type,
        })
      }
    }
    pos = pos + rec_len.to_int()
  }
  out
}

///|
/// 按路径查出 inode。
///
/// 根目录固定是 2 号 inode。`.` 段忽略，`..` 不特殊处理——要支持它得
/// 回溯父目录，而调用方通常已经有完整路径，用不着。
pub fn resolve_path(
  img : @block.Image,
  sb : Superblock,
  path : String,
) -> Inode raise Ext4Error {
  let mut current = read_inode(img, sb, 2L)
  let segments : Array[String] = []
  for piece in path.split("/") {
    let seg = piece.to_owned()
    if seg != "" && seg != "." {
      segments.push(seg)
    }
  }
  for seg in segments {
    if !current.is_directory() {
      raise Corrupt(reason="path component " + seg + " is not a directory")
    }
    let entries = list_directory(img, sb, current)
    let mut found = 0L
    for entry in entries {
      if entry.name == seg {
        found = entry.inode
        break
      }
    }
    if found == 0L {
      raise NotFound(name=seg)
    }
    current = read_inode(img, sb, found)
  }
  current
}
