///|
fn put_i64le(arr : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
  put_u32le(arr, off, value & 0xFFFFFFFFL)
  put_u32le(arr, off + 4, (value >> 32) & 0xFFFFFFFFL)
}

///|
fn put_raw(arr : FixedArray[Byte], off : Int32, raw : Bytes) -> Unit {
  for i in 0..<raw.length() {
    arr[off + i] = raw.at(i)
  }
}

///|
fn put_utf16le(arr : FixedArray[Byte], off : Int32, raw : Bytes) -> Unit {
  for i in 0..<raw.length() {
    arr[off + i * 2] = raw.at(i)
    arr[off + i * 2 + 1] = Byte::default()
  }
}

///|
/// 造一块 512 字节扇区的最小 GPT 镜像：保护性 MBR + 头 + 1 个分区项。
fn gpt_image(name : Bytes) -> Bytes {
  let entry_count : Int32 = 4
  let entry_size : Int32 = 128
  let entries_len = entry_count * entry_size
  let entries_arr = blank_sector(entries_len)
  // 分区项 0：类型 GUID 用可预测的字节，便于断言端序
  let type_bytes : Array[Int64] = [
    0x11L, 0x22L, 0x33L, 0x44L, 0x55L, 0x66L, 0x77L, 0x88L, 0x99L, 0xAAAL, 0xBBL,
    0xCCL, 0xDDL, 0xEEL, 0xFFL, 0x00L,
  ]
  for i in 0..<16 {
    put_u8(entries_arr, i, type_bytes[i])
  }
  put_i64le(entries_arr, 32, 2048L)
  put_i64le(entries_arr, 40, 4095L)
  put_utf16le(entries_arr, 56, name)
  let entries_bytes = Bytes::from_array(entries_arr)
  let entries_crc = @checksum.crc32(entries_bytes)
  let header = blank_sector(512)
  put_raw(header, 0, b"EFI PART")
  put_u32le(header, 8, 0x00010000L)
  put_u32le(header, 12, 92L)
  put_i64le(header, 24, 1L)
  put_i64le(header, 32, 33L)
  put_i64le(header, 40, 34L)
  put_i64le(header, 48, 2047L)
  put_i64le(header, 72, 2L)
  put_u32le(header, 80, entry_count.to_int64())
  put_u32le(header, 84, entry_size.to_int64())
  put_u32le(header, 88, entries_crc)
  // CRC 只覆盖 header_size 字节，不是整个扇区
  let head = blank_sector(92)
  for i in 0..<92 {
    head[i] = header[i]
  }
  let header_crc = @checksum.crc32(Bytes::from_array(head))
  put_u32le(header, 16, header_crc)
  // 拼镜像：LBA0 保护性 MBR，LBA1 头，LBA2 起是分区项数组
  let total = 512 * 2 + 512 * 32
  let image = blank_sector(total)
  let mbr = mbr_sector([
    (0x00L, 0xEEL, 1L, 0xFFFFFFFFL),
    (0L, 0L, 0L, 0L),
    (0L, 0L, 0L, 0L),
    (0L, 0L, 0L, 0L),
  ])
  put_raw(image, 0, mbr)
  put_raw(image, 512, Bytes::from_array(header))
  put_raw(image, 1024, entries_bytes)
  Bytes::from_array(image)
}

///|
test "gpt partitions are parsed with crc validation" {
  let img = @block.Image::from_bytes(gpt_image(b"root"), sector_size=512)
  let parts = @partition.read(img)
  assert_eq(parts.length(), 1)
  assert_eq(parts[0].name, "root")
  assert_eq(parts[0].start_lba, 2048L)
  assert_eq(parts[0].sector_count, 2048L)
  assert_true(parts[0].scheme is @partition.Gpt)
}

///|
test "gpt type guid is rendered in mixed endian order" {
  let img = @block.Image::from_bytes(gpt_image(b"data"), sector_size=512)
  let parts = @partition.read(img)
  assert_eq(parts[0].type_guid, "44332211-6655-8877-99aa-bbccddeeff00")
}

///|
test "corrupted gpt header is rejected" {
  let raw = gpt_image(b"root")
  let arr = FixedArray::make(raw.length(), Byte::default())
  for i in 0..<raw.length() {
    arr[i] = raw.at(i)
  }
  // 改动头里的磁盘 GUID，CRC 不再匹配
  arr[512 + 60] = b"\x7f".at(0)
  let img = @block.Image::from_bytes(Bytes::from_array(arr), sector_size=512)
  let result = try Ok(@partition.read(img)) catch { e => Err(e) }
  assert_true(result is Err(@partition.Corrupt(_)))
}
