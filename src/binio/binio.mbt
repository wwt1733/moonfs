///|
/// 定长整数读取的边界错误。
///
/// 所有读取函数都在真正取值前做区间检查，不会读到缓冲区之外，
/// 也不会静默截断。
pub suberror BinError {
  /// 读取区间 `[offset, offset + need)` 超出缓冲区长度 `len`。
  OutOfRange(offset~ : Int32, need~ : Int32, len~ : Int32)
}

///|
/// 人类可读的错误描述，供 CLI 与测试断言使用。
pub fn describe(err : BinError) -> String {
  match err {
    OutOfRange(offset~, need~, len~) =>
      "read " +
      need.to_string() +
      " byte(s) at offset " +
      offset.to_string() +
      " but buffer is " +
      len.to_string() +
      " byte(s) long"
  }
}

///|
fn ensure(bytes : Bytes, offset : Int32, need : Int32) -> Unit raise BinError {
  if offset < 0 || need < 0 || offset + need > bytes.length() {
    raise OutOfRange(offset~, need~, len=bytes.length())
  }
}

///|
/// 读一个无符号字节。
pub fn u8(bytes : Bytes, offset : Int32) -> Int64 raise BinError {
  ensure(bytes, offset, 1)
  bytes.at(offset).to_int64()
}

///|
/// 读小端 16 位无符号整数。
pub fn u16le(bytes : Bytes, offset : Int32) -> Int64 raise BinError {
  ensure(bytes, offset, 2)
  bytes.at(offset).to_int64() | (bytes.at(offset + 1).to_int64() << 8)
}

///|
/// 读大端 16 位无符号整数。
pub fn u16be(bytes : Bytes, offset : Int32) -> Int64 raise BinError {
  ensure(bytes, offset, 2)
  (bytes.at(offset).to_int64() << 8) | bytes.at(offset + 1).to_int64()
}

///|
/// 读小端 32 位无符号整数。
pub fn u32le(bytes : Bytes, offset : Int32) -> Int64 raise BinError {
  ensure(bytes, offset, 4)
  bytes.at(offset).to_int64() |
  (bytes.at(offset + 1).to_int64() << 8) |
  (bytes.at(offset + 2).to_int64() << 16) |
  (bytes.at(offset + 3).to_int64() << 24)
}

///|
/// 读大端 32 位无符号整数。
pub fn u32be(bytes : Bytes, offset : Int32) -> Int64 raise BinError {
  ensure(bytes, offset, 4)
  (bytes.at(offset).to_int64() << 24) |
  (bytes.at(offset + 1).to_int64() << 16) |
  (bytes.at(offset + 2).to_int64() << 8) |
  bytes.at(offset + 3).to_int64()
}

///|
/// 读小端 64 位整数。
///
/// 文件系统里大量 64 位字段需要按有符号解释（例如 NTFS 用 `-1` 表示
/// runlist 结束），因此这里直接返回 `Int64`；无符号语义请调用方自行判断。
pub fn i64le(bytes : Bytes, offset : Int32) -> Int64 raise BinError {
  ensure(bytes, offset, 8)
  u32le(bytes, offset) | (u32le(bytes, offset + 4) << 32)
}

///|
/// 读大端 64 位整数。
pub fn i64be(bytes : Bytes, offset : Int32) -> Int64 raise BinError {
  ensure(bytes, offset, 8)
  (u32be(bytes, offset) << 32) | u32be(bytes, offset + 4)
}

///|
/// 复制一段字节。
///
/// 返回新分配的 `Bytes`，与源缓冲区不共享内存。
pub fn slice(bytes : Bytes, offset : Int32, len : Int32) -> Bytes raise BinError {
  ensure(bytes, offset, len)
  let out : FixedArray[Byte] = FixedArray::make(len, Byte::default())
  for i in 0..<len {
    out[i] = bytes.at(offset + i)
  }
  Bytes::from_array(out)
}

///|
/// 比较前缀是否等于给定字节序列。用于识别魔数与 OEM 标识。
pub fn starts_with(bytes : Bytes, offset : Int32, prefix : Bytes) -> Bool {
  let n = prefix.length()
  if offset < 0 || offset + n > bytes.length() {
    return false
  }
  for i in 0..<n {
    if bytes.at(offset + i) != prefix.at(i) {
      return false
    }
  }
  true
}
