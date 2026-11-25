///|
/// ext4 解析错误。
pub suberror Ext4Error {
  /// 超级块魔数不是 0xEF53。
  NotExt4
  /// 字段值落在合法范围之外，或彼此不自洽。
  Corrupt(reason~ : String)
  /// 底层镜像读取失败。
  Io(reason~ : String)
  /// 路径或名字在卷里不存在。
  NotFound(name~ : String)
  /// 超级块里出现了本库不敢按猜测处理的结构。
  ///
  /// 与 `Corrupt` 分开：镜像没坏，是这个库不认识它。申报书写过「遇到
  /// 未知的 incompat 位直接拒绝打开并报错误，而不是按最接近的布局去
  /// 猜」——这条错误就是那个承诺的落点。
  UnsupportedFeature(feature~ : String)
}

///|
/// 超级块里 `s_magic` 的约定值。
const EXT4_MAGIC : Int64 = 0xEF53

///|
/// 超级块在卷内的固定偏移。
///
/// 不管块大小是多少，它都在引导块之后的 1024 字节处——1 KiB 块的卷里
/// 这是第 1 个块，4 KiB 块的卷里它仍然在偏移 1024，不是块边界。
const SUPERBLOCK_OFFSET : Int64 = 1024

///|
/// 超级块结构的固定长度。
const SUPERBLOCK_SIZE : Int64 = 1024

// ---- s_feature_compat：旧实现不认识也能安全读写 ----

///|

///|

///|

// ---- s_feature_incompat：不认识就不能读 ----

///|
const INCOMPAT_FILETYPE : Int64 = 0x0002

///|
const INCOMPAT_EXTENTS : Int64 = 0x0040

///|
const INCOMPAT_64BIT : Int64 = 0x0080

///|
const INCOMPAT_MMP : Int64 = 0x0100

///|
const INCOMPAT_FLEX_BG : Int64 = 0x0200

///|
const INCOMPAT_EA_INODE : Int64 = 0x0400

///|
const INCOMPAT_CSUM_SEED : Int64 = 0x1000

///|

///|

///|

///|
const INCOMPAT_CASEFOLD : Int64 = 0x10000

///|
const INCOMPAT_RECOVER : Int64 = 0x0004

///|

///|

///|

///|
/// 本库敢读的 incompat 位集合。
///
/// 这是**白名单**，不是黑名单：没列进来的位一律拒绝。理由是不认识的
/// 位可能改变块布局（`META_BG` 挪动描述符表、`BIGALLOC` 改变块到簇的
/// 映射），按"最接近的布局"去猜会读出错误内容而不报错——那比直接
/// 拒绝危险得多。
const INCOMPAT_SUPPORTED : Int64 = INCOMPAT_FILETYPE |
  INCOMPAT_EXTENTS |
  INCOMPAT_64BIT |
  INCOMPAT_FLEX_BG |
  INCOMPAT_MMP |
  INCOMPAT_EA_INODE |
  INCOMPAT_CSUM_SEED |
  INCOMPAT_CASEFOLD

// ---- s_feature_ro_compat：只读挂载时可以忽略的 ----

///|
const RO_COMPAT_BIGALLOC : Int64 = 0x0200

///|
/// 一个已解析超级块的 ext4 文件系统。
///
/// 只保存后续定位必需的量：块组数要用 `blocks_count` 与
/// `blocks_per_group`，inode 定位要用 `inodes_per_group` 与
/// `inode_size`，描述符表要用 `desc_size`。
pub(all) struct Superblock {
  /// 总 inode 数。ext4 没有这个字段的高 32 位，总量上限就是 2^32。
  inodes_count : Int64
  /// 总块数（已合并 64bit 特性的高 32 位）。
  blocks_count : Int64
  /// 第一个数据块。1 KiB 块的卷上是 1，更大的块上是 0。
  first_data_block : Int64
  /// 块大小（字节）。
  block_size : Int32
  blocks_per_group : Int64
  inodes_per_group : Int64
  /// 单个 inode 记录大小（字节），通常是 128 或 256。
  inode_size : Int32
  /// 块组描述符大小（字节）：无 64bit 时 32，有则 64。
  desc_size : Int32
  feature_compat : Int64
  feature_incompat : Int64
  feature_ro_compat : Int64
  /// 卷 UUID，16 字节。
  uuid : Bytes
  /// 卷标，去掉了尾部填充的零字节。
  volume_name : String
  /// 卷在镜像内的字节起点（分区起始扇区 × 扇区大小）。
  base_offset : Int64
  /// 块组数量。
  groups_count : Int64
  /// 超级块声称需要日志重放。
  ///
  /// 不拒绝打开：重放只影响元数据是否最新，多数情况下能读出的内容仍然
  /// 自洽。但这个标志要暴露出去——调用方有权知道读到的可能不是最新状态。
  needs_recovery : Bool
}

///|

///|
fn rd_u16(buf : Bytes, off : Int32) -> Int64 raise Ext4Error {
  @binio.u16le(buf, off) catch {
    _ => raise Corrupt(reason="field read out of range at " + off.to_string())
  }
}

///|
fn rd_u32(buf : Bytes, off : Int32) -> Int64 raise Ext4Error {
  @binio.u32le(buf, off) catch {
    _ => raise Corrupt(reason="field read out of range at " + off.to_string())
  }
}

///|
/// 把 16 字节的定长字段转成字符串，去掉尾部的零字节。
///
/// ext4 的卷标没有编码约定，实际几乎都是 UTF-8；遇到非法字节时按替换
/// 字符处理，不因为卷标而拒绝整个卷。
fn fixed_string(
  buf : Bytes,
  off : Int32,
  len : Int32,
) -> String raise Ext4Error {
  let raw = @binio.slice(buf, off, len) catch {
    _ => raise Corrupt(reason="string field out of range at " + off.to_string())
  }
  let mut end = len
  while end > 0 && raw.at(end - 1) == b'\x00' {
    end = end - 1
  }
  let trimmed = @binio.slice(raw, 0, end) catch { _ => raw }
  @utf8.decode_lossy(trimmed)
}

///|
/// 从卷起始扇区打开 ext4 文件系统。
///
/// `start_lba` 是分区起始扇区；对裸文件系统镜像传 0。
pub fn Superblock::open(
  img : @block.Image,
  start_lba : Int64,
) -> Superblock raise Ext4Error {
  let base = start_lba * img.sector_size().to_int64()
  Superblock::open_at(img, base)
}

///|
/// 从镜像内的字节偏移打开 ext4 文件系统。
pub fn Superblock::open_at(
  img : @block.Image,
  base_offset : Int64,
) -> Superblock raise Ext4Error {
  let raw = img.read(base_offset + SUPERBLOCK_OFFSET, SUPERBLOCK_SIZE.to_int()) catch {
    err => raise Io(reason="cannot read superblock: " + @block.reason_of(err))
  }
  parse_superblock(raw, base_offset)
}

///|
/// 解析 1024 字节的超级块。
pub fn parse_superblock(
  raw : Bytes,
  base_offset : Int64,
) -> Superblock raise Ext4Error {
  if raw.length() < SUPERBLOCK_SIZE.to_int() {
    raise Corrupt(reason="superblock buffer is shorter than 1024 bytes")
  }
  // 先认魔数：不是 ext4 就立刻返回，别拿后面的字段当噪声去校验
  if rd_u16(raw, 0x38) != EXT4_MAGIC {
    raise NotExt4
  }
  let feature_compat = rd_u32(raw, 0x5C)
  let feature_incompat = rd_u32(raw, 0x60)
  let feature_ro_compat = rd_u32(raw, 0x64)

  // 没有位取反运算符时，0xFFFFFFFF - x 等价于 x 在 32 位内的补
  let unknown = feature_incompat & (0xFFFFFFFFL - INCOMPAT_SUPPORTED)
  if unknown != 0L {
    raise UnsupportedFeature(feature="incompat 0x" + hex32(unknown))
  }

  let log_block_size = rd_u32(raw, 0x18)
  if log_block_size > 6L {
    raise Corrupt(
      reason="s_log_block_size " +
        log_block_size.to_string() +
        " is out of range",
    )
  }
  let block_size = (1024L << log_block_size.to_int()).to_int()

  let inode_size_raw = rd_u16(raw, 0x58)
  let rev_level = rd_u32(raw, 0x4C)
  // 老修订版没有这个字段，固定 128 字节
  let inode_size = if rev_level == 0L || inode_size_raw == 0L {
    128
  } else {
    inode_size_raw.to_int()
  }
  if inode_size < 128 || inode_size > block_size || inode_size % 128 != 0 {
    raise Corrupt(reason="inode size " + inode_size.to_string() + " is invalid")
  }

  let has_64bit = (feature_incompat & INCOMPAT_64BIT) != 0L
  let desc_size = if has_64bit {
    let raw_desc = rd_u16(raw, 0xFE).to_int()
    // 写了 64bit 就必须给出 >= 64 的描述符大小，否则描述符表没法按项走
    if raw_desc < 64 || raw_desc > block_size {
      raise Corrupt(
        reason="descriptor size " +
          raw_desc.to_string() +
          " contradicts 64bit feature",
      )
    }
    raw_desc
  } else {
    32
  }

  // bigalloc 把「块」重新定义成「簇」，block->physical 的映射随之改变。
  // 只读兼容位里只有这一位会动结构，其余可以安全忽略。
  if (feature_ro_compat & RO_COMPAT_BIGALLOC) != 0L {
    let log_cluster = rd_u32(raw, 0x1C)
    if log_cluster != log_block_size {
      raise UnsupportedFeature(feature="bigalloc")
    }
  }

  let blocks_lo = rd_u32(raw, 0x04)
  let blocks_hi = if has_64bit { rd_u32(raw, 0x150) } else { 0L }
  let blocks_count = (blocks_hi << 32) | blocks_lo
  let inodes_count = rd_u32(raw, 0x00)
  let blocks_per_group = rd_u32(raw, 0x20)
  let inodes_per_group = rd_u32(raw, 0x28)
  let first_data_block = rd_u32(raw, 0x14)

  if blocks_count <= 0L || blocks_per_group <= 0L || inodes_per_group <= 0L {
    raise Corrupt(reason="superblock has a zero count where one is required")
  }
  if inodes_count > 0L && inodes_per_group > inodes_count {
    raise Corrupt(reason="inodes per group exceeds the total inode count")
  }

  let groups_count = (blocks_count - first_data_block + blocks_per_group - 1L) /
    blocks_per_group

  let uuid = @binio.slice(raw, 0x68, 16) catch {
    _ => raise Corrupt(reason="uuid field out of range")
  }

  {
    inodes_count,
    blocks_count,
    first_data_block,
    block_size,
    blocks_per_group,
    inodes_per_group,
    inode_size,
    desc_size,
    feature_compat,
    feature_incompat,
    feature_ro_compat,
    uuid,
    volume_name: fixed_string(raw, 0x78, 16),
    base_offset,
    groups_count,
    needs_recovery: (feature_incompat & INCOMPAT_RECOVER) != 0L,
  }
}

///|
/// 32 位十六进制，用于错误信息里指出是哪一位不认识。
fn hex32(value : Int64) -> String {
  let digits = "0123456789abcdef"
  let mut out = ""
  let mut shift = 28
  while shift >= 0 {
    let nibble = (value >> shift) & 0xF
    out = out + digits[nibble.to_int()].to_string()
    shift = shift - 4
  }
  out
}

///|
/// 卷总字节数。
pub fn Superblock::size(self : Superblock) -> Int64 {
  self.blocks_count * self.block_size.to_int64()
}

///|
/// 块号 → 镜像内字节偏移。
///
/// 所有块号都是相对卷起点算的，必须加 `base_offset`。整盘镜像上分区不
/// 从 0 开始时，漏加它会把别处的数据当成文件内容读。
pub fn Superblock::block_offset(self : Superblock, block : Int64) -> Int64 {
  self.base_offset + block * self.block_size.to_int64()
}

///|
/// 块组描述符表的起始块号。
///
/// 1 KiB 块的卷上超级块占满第 0 块、描述符表在第 2 块；更大的块上超级
/// 块从偏移 1024 开始、仍落在第 0 块里，描述符表就紧跟在第 1 块。
pub fn Superblock::desc_table_block(self : Superblock) -> Int64 {
  if self.block_size == 1024 {
    2L
  } else {
    1L
  }
}

///|
/// 结构层错误的人类可读描述。
pub fn describe_error(err : Ext4Error) -> String {
  match err {
    NotExt4 => "not an ext2/3/4 filesystem (magic 0xEF53 missing)"
    Corrupt(reason~) => "corrupt: " + reason
    Io(reason~) => "io: " + reason
    NotFound(name~) => "not found: " + name
    UnsupportedFeature(feature~) => "unsupported ext4 feature: " + feature
  }
}
