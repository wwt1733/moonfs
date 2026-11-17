///|
fn nb_zero(size : Int32) -> FixedArray[Byte] {
  FixedArray::make(size, Byte::default())
}

///|
fn nb_u8(arr : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
  arr[off] = (value & 0xFFL).to_int().to_byte()
}

///|
fn nb_u16le(arr : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
  nb_u8(arr, off, value)
  nb_u8(arr, off + 1, value >> 8)
}

///|
fn nb_i64le(arr : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
  let mut rest = value
  for i in 0..<8 {
    nb_u8(arr, off + i, rest & 0xFFL)
    rest = rest >> 8
  }
}

///|
fn ntfs_boot_sector(
  bytes_per_sector : Int64,
  sectors_per_cluster : Int64,
  total_sectors : Int64,
  mft_lcn : Int64,
  mft_record_clusters : Int64,
  index_record_clusters : Int64,
) -> Bytes {
  let arr = nb_zero(512)
  arr[0] = b"\xeb".at(0)
  arr[1] = b"\x52".at(0)
  arr[2] = b"\x90".at(0)
  let oem = b"NTFS    "
  for i in 0..<8 {
    arr[3 + i] = oem.at(i)
  }
  nb_u16le(arr, 0x0B, bytes_per_sector)
  nb_u8(arr, 0x0D, sectors_per_cluster)
  nb_i64le(arr, 0x28, total_sectors)
  nb_i64le(arr, 0x30, mft_lcn)
  nb_i64le(arr, 0x38, mft_lcn + 8L)
  nb_u8(arr, 0x40, mft_record_clusters)
  nb_u8(arr, 0x44, index_record_clusters)
  nb_u16le(arr, 510, 0xAA55L)
  Bytes::from_array(arr)
}

///|
test "ntfs geometry is decoded from the boot sector" {
  let vol = @ntfs.parse_boot_sector(
    ntfs_boot_sector(512L, 8L, 0x20000L, 4L, 0xF6L, 1L),
  )
  assert_eq(vol.bytes_per_sector, 512)
  assert_eq(vol.sectors_per_cluster, 8)
  assert_eq(vol.cluster_size, 4096)
  assert_eq(vol.mft_lcn, 4L)
  assert_eq(vol.mft_offset(), 16384L)
  assert_eq(vol.size(), 0x20000L * 512L)
}

///|
test "negative clusters-per-record is read as a power of two" {
  // 0xF6 == -10 -> 2^10 == 1024 bytes
  let vol = @ntfs.parse_boot_sector(
    ntfs_boot_sector(512L, 8L, 0x20000L, 4L, 0xF6L, 1L),
  )
  assert_eq(vol.mft_record_size, 1024)
  assert_eq(vol.index_record_size, 4096)
}

///|
test "positive clusters-per-record multiplies by cluster size" {
  let vol = @ntfs.parse_boot_sector(
    ntfs_boot_sector(4096L, 1L, 0x1000L, 4L, 2L, 2L),
  )
  assert_eq(vol.cluster_size, 4096)
  assert_eq(vol.mft_record_size, 8192)
}

///|
test "non-ntfs volume is rejected" {
  let arr = nb_zero(512)
  let boot = Bytes::from_array(arr)
  let result = Ok(@ntfs.parse_boot_sector(boot)) catch { e => Err(e) }
  assert_true(result is Err(@ntfs.NotNtfs))
}

///|
test "absurd sector size is rejected as bad geometry" {
  let boot = ntfs_boot_sector(1000L, 8L, 0x20000L, 4L, 0xF6L, 1L)
  let result = Ok(@ntfs.parse_boot_sector(boot)) catch { e => Err(e) }
  assert_true(result is Err(@ntfs.BadGeometry(_)))
}

///|
test "index record size comes from 0x44, not the unused bytes at 0x41" {
  // 真实 Windows 卷在 0x41..0x43 写 0。曾经误把 0x41 当作
  // clusters-per-index-buffer，于是 record_size(0) 被判为非法编码，
  // 整块卷打不开——而合成镜像恰好把 0x41 也写成有效值，测试一直是绿的。
  // 这里往那三个未使用字节里塞垃圾，解析结果必须不受影响。
  let arr = nb_zero(512)
  let oem = b"NTFS    "
  for i in 0..<8 {
    arr[3 + i] = oem.at(i)
  }
  nb_u16le(arr, 0x0B, 512L)
  nb_u8(arr, 0x0D, 8L)
  nb_i64le(arr, 0x28, 0x20000L)
  nb_i64le(arr, 0x30, 4L)
  nb_i64le(arr, 0x38, 12L)
  nb_u8(arr, 0x40, 0xF6L)
  nb_u8(arr, 0x41, 0x07L)
  nb_u8(arr, 0x42, 0x5AL)
  nb_u8(arr, 0x43, 0xFFL)
  nb_u8(arr, 0x44, 1L)
  nb_u16le(arr, 510, 0xAA55L)
  let vol = @ntfs.parse_boot_sector(Bytes::from_array(arr))
  assert_eq(vol.index_record_size, 4096)
}

///|
test "volume serial is read from 0x48" {
  let arr = nb_zero(512)
  let oem = b"NTFS    "
  for i in 0..<8 {
    arr[3 + i] = oem.at(i)
  }
  nb_u16le(arr, 0x0B, 512L)
  nb_u8(arr, 0x0D, 8L)
  nb_i64le(arr, 0x28, 0x20000L)
  nb_i64le(arr, 0x30, 4L)
  nb_i64le(arr, 0x38, 12L)
  nb_u8(arr, 0x40, 0xF6L)
  nb_u8(arr, 0x44, 1L)
  nb_i64le(arr, 0x48, 0x1234ABCDL)
  nb_u16le(arr, 510, 0xAA55L)
  let vol = @ntfs.parse_boot_sector(Bytes::from_array(arr))
  assert_eq(vol.serial_number, 0x1234ABCDL)
}
