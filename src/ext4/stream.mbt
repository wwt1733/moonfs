///|
/// 读出一个 inode 的完整内容。
///
/// 未初始化段保持零：文件长度已经算上它，但磁盘上没有真实数据。跳过它
/// 比读出磁盘上的旧字节安全——那些字节可能属于已被删除的文件。
pub fn read_inode_data(
  img : @block.Image,
  sb : Superblock,
  inode : Inode,
) -> Bytes raise Ext4Error {
  check_readable_inode(inode)
  if inode.size == 0L {
    return b""
  }
  // 快符号链接：目标路径直接存在 i_block 的 60 字节里，不占数据块
  if inode.is_symlink() && !inode.uses_extents() {
    if inode.size > 60L {
      raise UnsupportedFeature(feature="slow symlink target")
    }
    return @binio.slice(inode.block, 0, inode.size.to_int()) catch {
      _ => raise Corrupt(reason="symlink target is outside i_block")
    }
  }
  let runs = extent_runs(img, sb, inode)
  read_runs(img, sb, runs, inode.size)
}

///|
fn read_runs(
  img : @block.Image,
  sb : Superblock,
  runs : Array[ExtentRun],
  size : Int64,
) -> Bytes raise Ext4Error {
  let total = size.to_int()
  let out : Array[Byte] = []
  let mut i = 0
  while i < total {
    out.push(b'\x00')
    i = i + 1
  }
  let block_size = sb.block_size.to_int64()
  for run in runs {
    // 未初始化段对应的位置保持零，不去读磁盘
    if run.uninitialized {
      continue
    }
    let mut k = 0L
    while k < run.length {
      let logical = run.logical + k
      let byte_start = logical * block_size
      if byte_start >= size {
        break
      }
      let data = img.read(sb.block_offset(run.physical + k), sb.block_size) catch {
        err =>
          raise Io(
            reason="cannot read data block " +
              (run.physical + k).to_string() +
              ": " +
              @block.reason_of(err),
          )
      }
      let remaining = size - byte_start
      let count = if block_size < remaining {
        block_size.to_int()
      } else {
        remaining.to_int()
      }
      let mut j = 0
      while j < count {
        out[byte_start.to_int() + j] = data.at(j)
        j = j + 1
      }
      k = k + 1L
    }
  }
  Bytes::from_array(out)
}
