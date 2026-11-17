///|
fn mz_zero(size : Int32) -> FixedArray[Byte] {
  FixedArray::make(size, Byte::default())
}

///|
fn mz_u8(arr : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
  arr[off] = (value & 0xFFL).to_int().to_byte()
}

///|
fn mz_u16le(arr : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
  mz_u8(arr, off, value)
  mz_u8(arr, off + 1, value >> 8)
}

///|
fn mz_u32le(arr : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
  let mut rest = value
  for i in 0..<4 {
    mz_u8(arr, off + i, rest & 0xFFL)
    rest = rest >> 8
  }
}

///|
fn mz_ascii(arr : FixedArray[Byte], off : Int32, text : String) -> Unit {
  let mut i = 0
  for ch in text {
    arr[off + i] = ch.to_int().to_byte()
    i = i + 1
  }
}

///|
/// 把字符串按 UTF-16LE 写入，返回写入字节数。
fn mz_utf16le(arr : FixedArray[Byte], off : Int32, text : String) -> Int32 {
  let mut written = 0
  for ch in text {
    mz_u16le(arr, off + written, ch.to_int().to_int64())
    written = written + 2
  }
  written
}

///|
/// 构造一条带 USA 的 1024 字节记录。
///
/// `usn` 写进两个扇区末尾，`tail0` / `tail1` 是真实的扇区末尾字节，
/// 被搬到 USA 数组里。
fn mz_record_with_fixup(
  usn : Int64,
  tail0 : Int64,
  tail1 : Int64,
) -> FixedArray[Byte] {
  let arr = mz_zero(1024)
  mz_ascii(arr, 0, "FILE")
  mz_u16le(arr, 0x04, 0x30)
  mz_u16le(arr, 0x06, 3)
  mz_u16le(arr, 0x30, usn)
  mz_u16le(arr, 0x32, tail0)
  mz_u16le(arr, 0x34, tail1)
  mz_u16le(arr, 510, usn)
  mz_u16le(arr, 1022, usn)
  arr
}

///|
test "fixup 还原被搬到 USA 里的扇区末尾" {
  let raw = mz_record_with_fixup(0x0001, 0xBBAA, 0xDDCC)
  let fixed = @ntfs.apply_fixup(Bytes::from_array(raw), 512, "test record") catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(fixed.at(510).to_int(), 0xAA)
  assert_eq(fixed.at(511).to_int(), 0xBB)
  assert_eq(fixed.at(1022).to_int(), 0xCC)
  assert_eq(fixed.at(1023).to_int(), 0xDD)
}

///|
test "fixup 发现撕裂写时报错" {
  let raw = mz_record_with_fixup(0x0001, 0xBBAA, 0xDDCC)
  // 篡改第二个扇区末尾的 USN，模拟写到一半断电
  mz_u16le(raw, 1022, 0x0002)
  let message = try {
    let _ = @ntfs.apply_fixup(Bytes::from_array(raw), 512, "rec")
    "no error"
  } catch {
    err => @ntfs.describe_error(err)
  }
  assert_true(message.contains("torn write"))
}

///|
test "记录头解析出属性起点与目录标志" {
  let raw = mz_record_with_fixup(0x0001, 0, 0)
  mz_u16le(raw, 0x10, 7)
  mz_u16le(raw, 0x12, 2)
  mz_u16le(raw, 0x14, 0x38)
  mz_u16le(raw, 0x16, 0x0003)
  mz_u32le(raw, 0x18, 0x200)
  let fixed = @ntfs.apply_fixup(Bytes::from_array(raw), 512, "rec") catch {
    _ => return
  }
  let header = @ntfs.parse_record(fixed) catch { _ => return }
  assert_eq(header.sequence, 7L)
  assert_eq(header.hard_links, 2L)
  assert_eq(header.first_attr, 0x38)
  assert_true(header.in_use())
  assert_true(header.is_directory())
  assert_true(!header.is_extension())
}

///|
test "BAAD 签名被识别为坏记录" {
  let raw = mz_zero(1024)
  mz_ascii(raw, 0, "BAAD")
  let message = try {
    let _ = @ntfs.parse_record(Bytes::from_array(raw))
    "no error"
  } catch {
    err => @ntfs.describe_error(err)
  }
  assert_true(message.contains("BAAD"))
}

///|
/// 在 `off` 处写一个常驻属性头，返回对齐后的属性总长度。
fn mz_resident_attr(
  arr : FixedArray[Byte],
  off : Int32,
  type_code : Int64,
  value_len : Int32,
) -> Int32 {
  let total = 0x18 + value_len
  let aligned = (total + 7) / 8 * 8
  mz_u32le(arr, off, type_code)
  mz_u32le(arr, off + 4, aligned.to_int64())
  mz_u8(arr, off + 8, 0)
  mz_u8(arr, off + 9, 0)
  mz_u16le(arr, off + 0x0A, 0x18)
  mz_u16le(arr, off + 0x0C, 0)
  mz_u16le(arr, off + 0x0E, 1)
  mz_u32le(arr, off + 0x10, value_len.to_int64())
  mz_u16le(arr, off + 0x14, 0x18)
  aligned
}

///|
test "属性链遍历读出一个 FILE_NAME" {
  let raw = mz_record_with_fixup(0x0001, 0, 0)
  mz_u16le(raw, 0x14, 0x38)
  let name = "hello.txt"
  let value_len = 0x42 + name.length() * 2
  let first_len = mz_resident_attr(raw, 0x38, 0x30, value_len)
  let value_off = 0x38 + 0x18
  mz_u32le(raw, value_off, 5) // parent 记录号
  mz_u16le(raw, value_off + 6, 1) // parent 序列号
  mz_u32le(raw, value_off + 0x30, 1234) // 逻辑大小
  mz_u8(raw, value_off + 0x40, name.length().to_int64())
  mz_u8(raw, value_off + 0x41, 1) // Win32 命名空间
  let written = mz_utf16le(raw, value_off + 0x42, name)
  assert_eq(written, name.length() * 2)
  let end = 0x38 + first_len
  mz_u32le(raw, end, 0xFFFFFFFF)
  mz_u32le(raw, 0x18, (end + 8).to_int64())
  let fixed = @ntfs.apply_fixup(Bytes::from_array(raw), 512, "rec") catch {
    _ => return
  }
  let header = @ntfs.parse_record(fixed) catch { _ => return }
  let attrs = @ntfs.parse_attributes(fixed, header.used_size) catch {
    _ => return
  }
  assert_eq(attrs.length(), 1)
  let attr = attrs[0]
  assert_eq(attr.type_code, 0x30L)
  assert_true(!attr.non_resident)
  let parsed = @ntfs.parse_file_name(attr.value) catch { _ => return }
  assert_eq(parsed.name, "hello.txt")
  assert_eq(parsed.parent_record, 5L)
  assert_eq(parsed.parent_sequence, 1L)
  assert_eq(parsed.logical_size, 1234L)
  assert_eq(parsed.name_ns, 1)
}

///|
test "runlist 解码含稀疏段与负增量" {
  let raw = mz_zero(16)
  mz_u8(raw, 0, 0x11) // 长度 1 字节、偏移 1 字节
  mz_u8(raw, 1, 3) // 3 个簇
  mz_u8(raw, 2, 5) // LCN 5
  mz_u8(raw, 3, 0x01) // 只有长度 → 稀疏
  mz_u8(raw, 4, 2) // 2 个簇
  mz_u8(raw, 5, 0x11)
  mz_u8(raw, 6, 4)
  mz_u8(raw, 7, 0xFB) // 有符号 -5，LCN 回退到 0
  mz_u8(raw, 8, 0)
  let runs = @ntfs.parse_runlist(Bytes::from_array(raw), 0, 0) catch {
    _ => return
  }
  assert_eq(runs.length(), 3)
  assert_eq(runs[0].vcn, 0L)
  assert_eq(runs[0].lcn, 5L)
  assert_eq(runs[0].clusters, 3L)
  assert_true(!runs[0].sparse)
  assert_eq(runs[1].vcn, 3L)
  assert_true(runs[1].sparse)
  assert_eq(runs[1].clusters, 2L)
  assert_eq(runs[2].vcn, 5L)
  assert_eq(runs[2].lcn, 0L)
  assert_eq(runs[2].clusters, 4L)
  // 普通区间
  match @ntfs.lookup_cluster(runs, 1) {
    Some(Some(lcn)) => assert_eq(lcn, 6L)
    _ => assert_true(false)
  }
  // 稀疏区间
  match @ntfs.lookup_cluster(runs, 4) {
    Some(None) => assert_true(true)
    _ => assert_true(false)
  }
  // 超出范围
  match @ntfs.lookup_cluster(runs, 9) {
    None => assert_true(true)
    _ => assert_true(false)
  }
}

///|
test "runlist 的 lowest_vcn 让分段属性正确衔接" {
  let raw = mz_zero(8)
  mz_u8(raw, 0, 0x11)
  mz_u8(raw, 1, 2)
  mz_u8(raw, 2, 10)
  mz_u8(raw, 3, 0)
  let runs = @ntfs.parse_runlist(Bytes::from_array(raw), 0, 100) catch {
    _ => return
  }
  assert_eq(runs.length(), 1)
  assert_eq(runs[0].vcn, 100L)
  assert_eq(runs[0].lcn, 10L)
}
