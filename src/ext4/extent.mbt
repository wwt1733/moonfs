///|
/// extent 树节点的魔数。
const EXTENT_MAGIC : Int64 = 0xF30A

///|
/// 树的最大深度。规范给的上限是 5；比这更深说明镜像坏了，不是树真的更长。
const MAX_EXTENT_DEPTH : Int64 = 5

///|
/// 一段连续的逻辑块到物理块的映射。
pub(all) struct ExtentRun {
  /// 起始逻辑块号。
  logical : Int64
  /// 连续块数。
  length : Int64
  /// 起始物理块号。未初始化段没有真实落盘位置，这里是 0。
  physical : Int64
  /// 未初始化：逻辑上占位、内容按零读。
  ///
  /// 预分配的段会这样标记——文件长度已经算上它，但磁盘上没写数据。
  /// 把它当普通段去读，会把别的文件的旧数据当成内容返回。
  uninitialized : Bool
}

///|
/// 取出一个 inode 的完整 extent 映射。
///
/// 根节点就嵌在 `i_block` 的 60 字节里，深度 0 时是叶子；深度大于 0
/// 时每个索引项指向一个块，块里是下一层。
pub fn extent_runs(
  img : @block.Image,
  sb : Superblock,
  inode : Inode,
) -> Array[ExtentRun] raise Ext4Error {
  if !inode.uses_extents() {
    raise UnsupportedFeature(feature="inode without extents (legacy block map)")
  }
  let runs : Array[ExtentRun] = []
  walk_extent_node(img, sb, inode.block, 0L, runs)
  runs
}

///|
fn walk_extent_node(
  img : @block.Image,
  sb : Superblock,
  node : Bytes,
  level : Int64,
  runs : Array[ExtentRun],
) -> Unit raise Ext4Error {
  if level > MAX_EXTENT_DEPTH {
    raise Corrupt(reason="extent tree is deeper than 5 levels")
  }
  if node.length() < 12 {
    raise Corrupt(reason="extent node is shorter than its 12-byte header")
  }
  let magic = rd_u16(node, 0x00)
  if magic != EXTENT_MAGIC {
    raise Corrupt(reason="extent node magic is 0x" + hex32(magic))
  }
  let entries = rd_u16(node, 0x02)
  let max_entries = rd_u16(node, 0x04)
  let depth = rd_u16(node, 0x06)
  if depth > MAX_EXTENT_DEPTH {
    raise Corrupt(reason="extent node claims depth " + depth.to_string())
  }
  // 节点可能是 inode 里的 60 字节，也可能是一整块；容量按实际长度算
  let capacity = (node.length() - 12) / 12
  if entries > capacity.to_int64() {
    raise Corrupt(
      reason="extent node holds " +
        entries.to_string() +
        " entries but only fits " +
        capacity.to_string(),
    )
  }
  if max_entries > capacity.to_int64() || max_entries < entries {
    raise Corrupt(
      reason="extent node max_entries " +
        max_entries.to_string() +
        " is inconsistent",
    )
  }

  let mut i = 0L
  while i < entries {
    let at = 12 + (i * 12).to_int()
    if depth == 0L {
      let logical = rd_u32(node, at)
      let raw_len = rd_u16(node, at + 4)
      let physical = (rd_u16(node, at + 6) << 32) | rd_u32(node, at + 8)
      // ee_len 的高位是「未初始化」标记，不是长度的一部分
      let uninit = raw_len > 0x8000L
      let length = if uninit { raw_len - 0x8000L } else { raw_len }
      if length > 0L {
        runs.push({ logical, length, physical, uninitialized: uninit, })
      }
    } else {
      let child_block = (rd_u16(node, at + 8) << 32) | rd_u32(node, at + 4)
      let child = img.read(sb.block_offset(child_block), sb.block_size) catch {
        err =>
          raise Io(
            reason="cannot read extent node block " +
              child_block.to_string() +
              ": " +
              @block.reason_of(err),
          )
      }
      walk_extent_node(img, sb, child, level + 1L, runs)
    }
    i = i + 1L
  }
}
