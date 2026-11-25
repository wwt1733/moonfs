///|
/// 一个块组描述符。
///
/// 只保留定位用得到的字段：inode 表在哪、有多少空闲项。位图与校验和
/// 是给写入方用的，只读解析不需要。
pub(all) struct GroupDesc {
  index : Int64
  /// inode 表起始块号。
  inode_table : Int64
  free_blocks_count : Int64
  free_inodes_count : Int64
  used_dirs_count : Int64
  /// 描述符标志。`INODE_UNINIT` / `BLOCK_UNINIT` 表示对应位图未初始化，
  /// 但 inode 表本身仍在 `inode_table` 处，读取不受影响。
  flags : Int64
}

///|
/// 读出一个块组的描述符。
///
/// 描述符表紧跟在超级块之后（1 KiB 块在第 2 块、更大块在第 1 块），
/// 每项 `desc_size` 字节——32 位卷是 32，开了 64bit 是 64。按固定 32
/// 字节去走会从第二项开始全部错位。
pub fn read_group_desc(
  img : @block.Image,
  sb : Superblock,
  index : Int64,
) -> GroupDesc raise Ext4Error {
  if index < 0L || index >= sb.groups_count {
    raise Corrupt(
      reason="group index " + index.to_string() + " is outside the volume",
    )
  }
  let table_block = sb.desc_table_block()
  let offset = sb.block_offset(table_block) + index * sb.desc_size.to_int64()
  let raw = img.read(offset, sb.desc_size) catch {
    err =>
      raise Io(reason="cannot read group descriptor: " + @block.reason_of(err))
  }
  let has_64bit = sb.desc_size >= 64
  let inode_table = read_block_ptr(raw, 0x08, 0x28, has_64bit)
  let free_blocks = read_count16(raw, 0x0C, 0x2C, has_64bit)
  let free_inodes = read_count16(raw, 0x0E, 0x2E, has_64bit)
  let used_dirs = read_count16(raw, 0x10, 0x30, has_64bit)
  {
    index,
    inode_table,
    free_blocks_count: free_blocks,
    free_inodes_count: free_inodes,
    used_dirs_count: used_dirs,
    flags: rd_u16(raw, 0x12),
  }
}

///|
/// 读一个 48 位的块指针：低 32 位在 `lo_off`，高 16 位在 `hi_off`。
fn read_block_ptr(
  raw : Bytes,
  lo_off : Int32,
  hi_off : Int32,
  has_64bit : Bool,
) -> Int64 raise Ext4Error {
  let lo = rd_u32(raw, lo_off)
  if !has_64bit {
    return lo
  }
  let hi = rd_u16(raw, hi_off)
  (hi << 32) | lo
}

///|
/// 读一个 32 位计数的低 16 位与高 16 位（分别位于两个位置）。
fn read_count16(
  raw : Bytes,
  lo_off : Int32,
  hi_off : Int32,
  has_64bit : Bool,
) -> Int64 raise Ext4Error {
  let lo = rd_u16(raw, lo_off)
  if !has_64bit {
    return lo
  }
  let hi = rd_u16(raw, hi_off)
  (hi << 16) | lo
}

///|
/// 从 inode 号反推它所在的块组。
///
/// inode 号从 1 开始，`s_inodes_per_group` 个一组。
pub fn group_of_inode(sb : Superblock, inode_number : Int64) -> Int64 {
  (inode_number - 1L) / sb.inodes_per_group
}

///|
/// inode 号在它所属块组内的下标（从 0 开始）。
pub fn index_in_group(sb : Superblock, inode_number : Int64) -> Int64 {
  (inode_number - 1L) % sb.inodes_per_group
}
