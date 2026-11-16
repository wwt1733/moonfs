///|
/// NTFS 解析错误。
pub suberror NtfsError {
  /// 卷头 OEM 标识不是 `NTFS    `。
  NotNtfs
  /// 扇区大小、簇大小等参数不自洽。
  BadGeometry(reason~ : String)
  /// 字段值落在合法范围之外。
  Corrupt(reason~ : String)
  /// 底层镜像读取失败。
  Io(reason~ : String)
}

///|
/// 一个已解析卷头的 NTFS 卷。
///
/// 只保存后续解析必需的量：簇映射要用 `cluster_size`，定位 MFT 要用
/// `mft_lcn`，分配记录缓冲要用 `mft_record_size`。
pub(all) struct Volume {
  bytes_per_sector : Int32
  sectors_per_cluster : Int32
  cluster_size : Int32
  total_sectors : Int64
  mft_lcn : Int64
  mft_mirror_lcn : Int64
  mft_record_size : Int32
  index_record_size : Int32
}

///|
/// 卷头里 OEM 标识的偏移与约定内容。
const OEM_OFFSET : Int32 = 3

///|
fn rd_u8(buf : Bytes, off : Int32) -> Int64 raise NtfsError {
  @binio.u8(buf, off) catch {
    _ => raise Corrupt(reason="field read out of range at " + off.to_string())
  }
}

///|
fn rd_u16(buf : Bytes, off : Int32) -> Int64 raise NtfsError {
  @binio.u16le(buf, off) catch {
    _ => raise Corrupt(reason="field read out of range at " + off.to_string())
  }
}

///|
fn rd_i64(buf : Bytes, off : Int32) -> Int64 raise NtfsError {
  @binio.i64le(buf, off) catch {
    _ => raise Corrupt(reason="field read out of range at " + off.to_string())
  }
}

///|
/// 把有符号字节解释为簇数。
///
/// NTFS 用负数编码"记录小于一个簇"的情形：值 `-n` 表示记录大小为
/// `2^n` 字节，而不是簇数的负数。
fn signed_byte(value : Int64) -> Int64 {
  if value > 0x7FL {
    value - 0x100L
  } else {
    value
  }
}

///|
/// 把 `clusters_per_record` 换算成字节数。
fn record_size(clusters_per_record : Int64, cluster_size : Int32) -> Int32 raise NtfsError {
  let signed = signed_byte(clusters_per_record)
  if signed > 0L {
    let size = signed * cluster_size.to_int64()
    if size <= 0L || size > 0x10000L {
      raise Corrupt(reason="record size " + size.to_string() + " out of range")
    }
    size.to_int()
  } else if signed < 0L && signed >= -16L {
    1 << (-signed).to_int()
  } else {
    raise Corrupt(reason="invalid clusters-per-record encoding " + signed.to_string())
  }
}

///|
fn is_power_of_two(value : Int64) -> Bool {
  value > 0L && (value & (value - 1L)) == 0L
}

///|
/// 解析卷头。
///
/// `start_lba` 是分区起始扇区；对整盘镜像直接传 0。
pub fn Volume::open(img : @block.Image, start_lba : Int64) -> Volume raise NtfsError {
  let offset = start_lba * img.sector_size().to_int64()
  let boot = img.read(offset, 512) catch {
    err => raise Io(reason="cannot read boot sector: " + @block.reason_of(err))
  }
  parse_boot_sector(boot)
}

///|
/// 从 512 字节卷头解析各字段。
pub fn parse_boot_sector(boot : Bytes) -> Volume raise NtfsError {
  if !@binio.starts_with(boot, OEM_OFFSET, b"NTFS    ") {
    raise NotNtfs
  }
  let bytes_per_sector = rd_u16(boot, 0x0B)
  let sectors_per_cluster = rd_u8(boot, 0x0D)
  if !is_power_of_two(bytes_per_sector) || bytes_per_sector < 256L || bytes_per_sector > 4096L {
    raise BadGeometry(reason="bytes per sector " + bytes_per_sector.to_string())
  }
  if !is_power_of_two(sectors_per_cluster) || sectors_per_cluster > 128L {
    raise BadGeometry(reason="sectors per cluster " + sectors_per_cluster.to_string())
  }
  let cluster_size = bytes_per_sector * sectors_per_cluster
  if cluster_size > 0x20000L {
    raise BadGeometry(reason="cluster size " + cluster_size.to_string() + " exceeds 128 KiB")
  }
  let total_sectors = rd_i64(boot, 0x28)
  let mft_lcn = rd_i64(boot, 0x30)
  let mft_mirror_lcn = rd_i64(boot, 0x38)
  if mft_lcn <= 0L || mft_mirror_lcn <= 0L {
    raise Corrupt(reason="mft location is not positive")
  }
  {
    bytes_per_sector: bytes_per_sector.to_int(),
    sectors_per_cluster: sectors_per_cluster.to_int(),
    cluster_size: cluster_size.to_int(),
    total_sectors: total_sectors,
    mft_lcn: mft_lcn,
    mft_mirror_lcn: mft_mirror_lcn,
    mft_record_size: record_size(rd_u8(boot, 0x40), cluster_size.to_int()),
    index_record_size: record_size(rd_u8(boot, 0x41), cluster_size.to_int()),
  }
}

///|
/// 卷的总字节数。
pub fn Volume::size(self : Volume) -> Int64 {
  self.total_sectors * self.bytes_per_sector.to_int64()
}

///|
/// 某个逻辑簇在镜像内的字节偏移。
pub fn Volume::cluster_offset(self : Volume, lcn : Int64) -> Int64 {
  lcn * self.cluster_size.to_int64()
}

///|
/// MFT 在镜像内的字节偏移。
pub fn Volume::mft_offset(self : Volume) -> Int64 {
  self.cluster_offset(self.mft_lcn)
}
