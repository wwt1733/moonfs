///|
fn blank_sector(size : Int32) -> FixedArray[Byte] {
  FixedArray::make(size, Byte::default())
}

///|
fn put_u8(arr : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
  arr[off] = (value & 0xFFL).to_int().to_byte()
}

///|
fn put_u16le(arr : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
  put_u8(arr, off, value)
  put_u8(arr, off + 1, value >> 8)
}

///|
fn put_u32le(arr : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
  put_u8(arr, off, value)
  put_u8(arr, off + 1, value >> 8)
  put_u8(arr, off + 2, value >> 16)
  put_u8(arr, off + 3, value >> 24)
}

///|
/// 造一个只有 4 个主分区槽的 512 字节 MBR 扇区。
fn mbr_sector(entries : Array[(Int64, Int64, Int64, Int64)]) -> Bytes {
  // (status, type, start_lba, sector_count)
  let arr = blank_sector(512)
  let mut i : Int32 = 0
  for entry in entries {
    let base = 446 + i * 16
    let (status, type_byte, start, count) = entry
    put_u8(arr, base, status)
    put_u8(arr, base + 4, type_byte)
    put_u32le(arr, base + 8, start)
    put_u32le(arr, base + 12, count)
    i = i + 1
  }
  put_u16le(arr, 510, 0xAA55L)
  Bytes::from_array(arr)
}

///|
test "mbr lists active partitions only" {
  let sector = mbr_sector([
    (0x80L, 0x07L, 2048L, 4096L),
    (0x00L, 0x00L, 0L, 0L),
    (0x00L, 0x83L, 6144L, 2048L),
    (0x00L, 0x00L, 0L, 0L),
  ])
  let img = @block.Image::from_bytes(sector, sector_size=512)
  let parts = @partition.read_mbr(img)
  assert_eq(parts.length(), 2)
  assert_eq(parts[0].start_lba, 2048L)
  assert_eq(parts[0].sector_count, 4096L)
  assert_true(parts[0].bootable)
  assert_eq(parts[0].mbr_type, 0x07L)
  assert_eq(parts[1].start_lba, 6144L)
  assert_false(parts[1].bootable)
  assert_eq(parts[1].end_lba(), 8191L)
}

///|
test "mbr without signature is rejected" {
  let arr = blank_sector(512)
  let img = @block.Image::from_bytes(Bytes::from_array(arr), sector_size=512)
  let result = Ok(@partition.read_mbr(img)) catch { e => Err(e) }
  assert_true(result is Err(@partition.BadSignature(_)))
}

///|
test "protective mbr is detected" {
  let sector = mbr_sector([
    (0x00L, 0xEEL, 1L, 0xFFFFFFFFL),
    (0L, 0L, 0L, 0L),
    (0L, 0L, 0L, 0L),
    (0L, 0L, 0L, 0L),
  ])
  let img = @block.Image::from_bytes(sector, sector_size=512)
  let parts = @partition.read_mbr(img)
  assert_true(@partition.has_protective_mbr(parts))
}
