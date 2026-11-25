///|
/// 一个 inode 记录里本库需要的部分。
pub(all) struct Inode {
  number : Int64
  /// 文件类型与权限位（`i_mode`）。
  mode : Int64
  /// 文件字节数（已合并 `i_size_high`）。
  size : Int64
  /// 修改时间（epoch 秒）。
  modified : Int64
  /// 修改时间的纳秒部分。
  modified_ns : Int64
  /// 创建时间（epoch 秒），仅当 inode 足够大、带 `i_crtime` 时有效。
  created : Int64
  /// 最后访问时间（epoch 秒）。
  accessed : Int64
  /// inode 变更时间（epoch 秒）。改权限、改大小都会更新它，与内容的
  /// 修改时间不是一回事。
  changed : Int64
  links_count : Int64
  /// `i_flags`。
  flags : Int64
  /// `i_block` 原文 60 字节：extent 树的根，或者旧式的 15 个块指针。
  block : Bytes
  /// 占用的 512 字节扇区数（`i_blocks_lo` 的口径，不是文件系统块）。
  sectors : Int64
}

///|
/// `i_mode` 里表示文件类型的掩码与取值。
const S_IFMT : Int64 = 0xF000

///|
const S_IFDIR : Int64 = 0x4000

///|
const S_IFREG : Int64 = 0x8000

///|
const S_IFLNK : Int64 = 0xA000

///|
/// `i_flags` 里影响读取方式的位。
const INODE_FLAG_ENCRYPT : Int64 = 0x00000800

///|
const INODE_FLAG_EXTENTS : Int64 = 0x00080000

///|
const INODE_FLAG_INLINE_DATA : Int64 = 0x01000000

///|
fn Inode::kind(self : Inode) -> Int64 {
  self.mode & S_IFMT
}

///|
pub fn Inode::is_directory(self : Inode) -> Bool {
  self.kind() == S_IFDIR
}

///|
pub fn Inode::is_regular(self : Inode) -> Bool {
  self.kind() == S_IFREG
}

///|
pub fn Inode::is_symlink(self : Inode) -> Bool {
  self.kind() == S_IFLNK
}

///|
pub fn Inode::uses_extents(self : Inode) -> Bool {
  (self.flags & INODE_FLAG_EXTENTS) != 0L
}

///|
/// 读一个 inode。
///
/// 定位链条是：inode 号 → 块组 → 该组的 inode 表起始块 → 组内槽位 ×
/// inode 大小。任何一步用了固定值（比如假定 inode 是 128 字节）都会从
/// 某个 inode 之后开始整体错位。
pub fn read_inode(
  img : @block.Image,
  sb : Superblock,
  number : Int64,
) -> Inode raise Ext4Error {
  if number <= 0L || number > sb.inodes_count {
    raise Corrupt(
      reason="inode " + number.to_string() + " is outside the volume",
    )
  }
  let group_index = group_of_inode(sb, number)
  let desc = read_group_desc(img, sb, group_index)
  let slot = index_in_group(sb, number)
  let offset = sb.block_offset(desc.inode_table) +
    slot * sb.inode_size.to_int64()
  let raw = img.read(offset, sb.inode_size) catch {
    err =>
      raise Io(
        reason="cannot read inode " +
          number.to_string() +
          ": " +
          @block.reason_of(err),
      )
  }
  parse_inode(raw, number)
}

///|
/// 把 `i_time` 与 `i_time_extra` 合成秒 + 纳秒。
///
/// ext4 把 2038 年之后的时间存在 extra 的低 2 位里（epoch 位），高位是
/// 纳秒。只读秒会让 2038 年后的时间戳全部回到 1970 附近。
fn split_time(lo : Int64, extra : Int64, has_extra : Bool) -> (Int64, Int64) {
  if !has_extra {
    return (lo, 0L)
  }
  let epoch = extra & 0x3L
  let ns = extra >> 2
  ((epoch << 32) | lo, ns)
}

///|
/// 解析一条 inode 记录。
pub fn parse_inode(raw : Bytes, number : Int64) -> Inode raise Ext4Error {
  let mode = rd_u16(raw, 0x00)
  let size_lo = rd_u32(raw, 0x04)
  let atime_lo = rd_u32(raw, 0x08)
  let ctime_lo = rd_u32(raw, 0x0C)
  let mtime_lo = rd_u32(raw, 0x10)
  let links = rd_u16(raw, 0x1A)
  let sectors = rd_u32(raw, 0x1C)
  let flags = rd_u32(raw, 0x20)

  // inode 大于 128 字节时才有额外字段，且实际有效长度由 i_extra_isize 声明
  let extra_isize = if raw.length() > 0x82 {
    let declared = rd_u16(raw, 0x80)
    if declared > 4L {
      declared.to_int()
    } else {
      0
    }
  } else {
    0
  }
  let has_mtime_extra = extra_isize >= 0x88 + 4 - 0x80
  let has_crtime = extra_isize >= 0x94 + 4 - 0x80
  let (modified, modified_ns) = if has_mtime_extra {
    split_time(mtime_lo, rd_u32(raw, 0x88), true)
  } else {
    split_time(mtime_lo, 0L, false)
  }
  let (changed, _) = if extra_isize >= 0x84 + 4 - 0x80 {
    split_time(ctime_lo, rd_u32(raw, 0x84), true)
  } else {
    split_time(ctime_lo, 0L, false)
  }
  let (accessed, _) = if extra_isize >= 0x8C + 4 - 0x80 {
    split_time(atime_lo, rd_u32(raw, 0x8C), true)
  } else {
    split_time(atime_lo, 0L, false)
  }
  let created = if has_crtime {
    let (secs, _) = split_time(rd_u32(raw, 0x90), rd_u32(raw, 0x94), true)
    secs
  } else {
    0L
  }

  let size_high = rd_u32(raw, 0x6C)
  let size = (size_high << 32) | size_lo
  let block = @binio.slice(raw, 0x28, 0x3C) catch {
    _ => raise Corrupt(reason="inode " + number.to_string() + " is too short")
  }
  {
    number,
    mode,
    size,
    modified,
    modified_ns,
    created,
    accessed,
    changed,
    links_count: links,
    flags,
    block,
    sectors,
  }
}

///|
/// 读 inode 的内容前先挡掉本库不支持的两类。
///
/// 加密要用户密钥，物理不可行；inline data 把小文件塞在 `i_block` 里，
/// 走的是另一条读取路径。两者都明确报错，而不是返回错位的字节。
pub fn check_readable_inode(inode : Inode) -> Unit raise Ext4Error {
  if (inode.flags & INODE_FLAG_ENCRYPT) != 0L {
    raise UnsupportedFeature(feature="fscrypt-encrypted inode")
  }
  if (inode.flags & INODE_FLAG_INLINE_DATA) != 0L {
    raise UnsupportedFeature(feature="inline data inode")
  }
}
