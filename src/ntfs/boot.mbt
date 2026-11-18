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
  /// 内容被 EFS 加密。
  ///
  /// 解密需要用户的证书与私钥，离线镜像解析器拿不到，因此这是物理上
  /// 不可行而非实现偷懒。带上路径是为了让调用方能告诉用户"哪个文件
  /// 读不了"，而不是整个卷失败。
  Encrypted(path~ : String)
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
  /// 卷在镜像内的字节起点（分区起始扇区 × 扇区大小）。
  ///
  /// 卷内所有 LCN 都是相对这个起点算的。整盘镜像上分区不是从 0 开始时，
  /// 漏加这个偏移会把别处的数据当成 MFT 读。
  base_offset : Int64
  /// 卷序列号。Windows 的 `dir` 里显示为 "Volume Serial Number"，
  /// 用来确认读到的确实是那块卷而不是同尺寸的另一块。
  serial_number : Int64
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
fn rd_u32(buf : Bytes, off : Int32) -> Int64 raise NtfsError {
  @binio.u32le(buf, off) catch {
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
fn record_size(
  clusters_per_record : Int64,
  cluster_size : Int32,
) -> Int32 raise NtfsError {
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
    raise Corrupt(
      reason="invalid clusters-per-record encoding " + signed.to_string(),
    )
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
pub fn Volume::open(
  img : @block.Image,
  start_lba : Int64,
) -> Volume raise NtfsError {
  let offset = start_lba * img.sector_size().to_int64()
  let boot = img.read(offset, 512) catch {
    err => raise Io(reason="cannot read boot sector: " + @block.reason_of(err))
  }
  let parsed = parse_boot_sector(boot)
  { ..parsed, base_offset: offset, }
}

///|
/// 从 512 字节卷头解析各字段。
pub fn parse_boot_sector(boot : Bytes) -> Volume raise NtfsError {
  if !@binio.starts_with(boot, OEM_OFFSET, b"NTFS    ") {
    raise NotNtfs
  }
  let bytes_per_sector = rd_u16(boot, 0x0B)
  let sectors_per_cluster = rd_u8(boot, 0x0D)
  if !is_power_of_two(bytes_per_sector) ||
    bytes_per_sector < 256L ||
    bytes_per_sector > 4096L {
    raise BadGeometry(reason="bytes per sector " + bytes_per_sector.to_string())
  }
  if !is_power_of_two(sectors_per_cluster) || sectors_per_cluster > 128L {
    raise BadGeometry(
      reason="sectors per cluster " + sectors_per_cluster.to_string(),
    )
  }
  let cluster_size = bytes_per_sector * sectors_per_cluster
  if cluster_size > 0x20000L {
    raise BadGeometry(
      reason="cluster size " + cluster_size.to_string() + " exceeds 128 KiB",
    )
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
    total_sectors,
    mft_lcn,
    mft_mirror_lcn,
    mft_record_size: record_size(rd_u8(boot, 0x40), cluster_size.to_int()),
    // 索引缓冲区大小在 0x44。0x41..0x43 是 clusters-per-MFT-record 之后的
    // 三个未使用字节，Windows 在那里写 0；误读成 0x41 会让 record_size()
    // 判定为非法编码，整卷打不开。真实 Windows 卷上就是这样暴露的。
    index_record_size: record_size(rd_u8(boot, 0x44), cluster_size.to_int()),
    base_offset: 0L,
    serial_number: rd_i64(boot, 0x48),
  }
}

///|
/// 卷的总字节数。
pub fn Volume::size(self : Volume) -> Int64 {
  self.total_sectors * self.bytes_per_sector.to_int64()
}

///|
/// 某个逻辑簇在镜像内的字节偏移。
///
/// 含卷基址：分区不在 0 位置时，LCN 0 也不在镜像 0 位置。
pub fn Volume::cluster_offset(self : Volume, lcn : Int64) -> Int64 {
  self.base_offset + lcn * self.cluster_size.to_int64()
}

///|
/// MFT 在镜像内的字节偏移。
pub fn Volume::mft_offset(self : Volume) -> Int64 {
  self.cluster_offset(self.mft_lcn)
}

///|
/// 把 NTFS 错误转成一行描述，供 CLI 与测试使用。
pub fn describe_error(err : NtfsError) -> String {
  match err {
    NotNtfs => "not an NTFS volume (OEM identifier mismatch)"
    BadGeometry(reason~) => "bad geometry: " + reason
    Corrupt(reason~) => "corrupt: " + reason
    Io(reason~) => "io: " + reason
    Encrypted(path~) => "encrypted: " + path
  }
}
