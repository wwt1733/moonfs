///|
fn dq_zero(size : Int32) -> FixedArray[Byte] {
  FixedArray::make(size, Byte::default())
}

///|
fn dq_u8(arr : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
  arr[off] = (value & 0xFFL).to_int().to_byte()
}

///|
fn dq_u16le(arr : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
  dq_u8(arr, off, value)
  dq_u8(arr, off + 1, value >> 8)
}

///|
fn dq_u32le(arr : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
  let mut rest = value
  for i in 0..<4 {
    dq_u8(arr, off + i, rest & 0xFFL)
    rest = rest >> 8
  }
}

///|
fn dq_utf16le(arr : FixedArray[Byte], off : Int32, text : String) -> Int32 {
  let mut written = 0
  for ch in text {
    dq_u16le(arr, off + written, ch.to_int().to_int64())
    written = written + 2
  }
  written
}

///|
/// 写一个索引项，返回对齐后的项长度。
fn dq_index_entry(
  arr : FixedArray[Byte],
  off : Int32,
  record_number : Int64,
  sequence : Int64,
  name : String,
  name_ns : Int64,
  flags : Int64,
  logical_size : Int64,
  last : Bool,
) -> Int32 {
  let key_len = 0x42 + name.length() * 2
  let total = 0x10 + key_len
  let aligned = (total + 7) / 8 * 8
  let entry_flags : Int64 = if last { 0x02 } else { 0 }
  // file reference：低 48 位记录号，高 16 位序列号
  let reference = record_number | (sequence << 48)
  dq_u32le(arr, off, reference & 0xFFFFFFFFL)
  dq_u32le(arr, off + 4, (reference >> 32) & 0xFFFFFFFFL)
  dq_u16le(arr, off + 0x08, aligned.to_int64())
  dq_u16le(arr, off + 0x0A, key_len.to_int64())
  dq_u16le(arr, off + 0x0C, entry_flags)
  // $FILE_NAME 结构
  let key = off + 0x10
  dq_u32le(arr, key, 5) // parent 记录号（根目录）
  dq_u16le(arr, key + 6, 5) // parent 序列号
  dq_u32le(arr, key + 0x30, logical_size)
  dq_u8(arr, key + 0x40, name.length().to_int64())
  dq_u8(arr, key + 0x41, name_ns)
  dq_u32le(arr, key + 0x38, flags)
  let _ = dq_utf16le(arr, key + 0x42, name)
  aligned
}

///|
test "索引节点解析出条目、跳过 DOS 短名" {
  let arr = dq_zero(512)
  // INDEX_ROOT 的值：属性类型 + 排序规则 + 块大小 + 簇数，然后是索引头
  dq_u32le(arr, 0x00, 0x30) // 按文件名索引
  dq_u32le(arr, 0x04, 1) // 排序规则
  dq_u32le(arr, 0x08, 4096) // 索引块大小
  dq_u8(arr, 0x0C, 1) // 每块簇数
  // 索引头从 0x10 开始
  dq_u32le(arr, 0x10, 0x10) // 条目区相对索引头的偏移
  let mut cursor = 0x20
  let len1 = dq_index_entry(arr, cursor, 42, 1, "a.txt", 1, 0, 100, false)
  cursor = cursor + len1
  let len2 = dq_index_entry(arr, cursor, 43, 1, "sub", 1, 0x10000000, 0, false)
  cursor = cursor + len2
  // 最后一个条目：哨兵，只有头没有 key
  dq_u16le(arr, cursor + 0x08, 0x10)
  dq_u16le(arr, cursor + 0x0A, 0)
  dq_u16le(arr, cursor + 0x0C, 0x02)
  cursor = cursor + 0x10
  // index_length 相对索引头（0x10）
  dq_u32le(arr, 0x14, (cursor - 0x10).to_int64())
  dq_u32le(arr, 0x18, (cursor - 0x10).to_int64())
  let out : Array[DirEntry] = []
  let failure = try {
    collect_index_entries(Bytes::from_array(arr), 0x10, out)
    ""
  } catch {
    err => describe_error(err)
  }
  assert_eq(failure, "")
  assert_eq(out.length(), 2)
  assert_eq(out[0].name, "a.txt")
  assert_eq(out[0].record_number, 42L)
  assert_eq(out[0].sequence, 1L)
  assert_eq(out[0].logical_size, 100L)
  assert_true(!out[0].is_directory())
  assert_eq(out[1].name, "sub")
  assert_eq(out[1].record_number, 43L)
  assert_true(out[1].is_directory())
}

///|
test "索引项长度为零时拒绝继续" {
  let arr = dq_zero(128)
  dq_u32le(arr, 0x00, 0x30)
  dq_u32le(arr, 0x10, 0x10)
  dq_u32le(arr, 0x14, 0x40)
  // 条目头长度字段为 0，会让遍历原地打转
  dq_u16le(arr, 0x28, 0)
  let out : Array[DirEntry] = []
  let failed = try {
    collect_index_entries(Bytes::from_array(arr), 0x10, out)
    false
  } catch {
    _ => true
  }
  assert_true(failed)
}
