///|
/// 把字节数组当成 ASCII 文本看，方便断言解压结果。
fn lz_text(bytes : Array[Byte]) -> String {
  let chars : Array[Char] = []
  for b in bytes {
    if b.to_int().to_char() is Some(c) {
      chars.push(c)
    }
  }
  String::from_array(chars)
}

///|
fn lz_bytes(values : Array[Int32]) -> Bytes {
  let arr : FixedArray[Byte] = FixedArray::make(
    values.length(),
    Byte::default(),
  )
  let mut i = 0
  for v in values {
    arr[i] = (v & 0xFF).to_byte()
    i = i + 1
  }
  Bytes::from_array(arr)
}

///|
test "未压缩块原样输出" {
  // header 0x0004：长度 5、不是压缩块、是最后一块
  let src = lz_bytes([0x04, 0x00, 0x61, 0x62, 0x63])
  let out = @ntfs.decompress(src) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(lz_text(out), "abc")
}

///|
test "短语回溯实现 RLE 式压缩" {
  // flags 0x02：第 1 个 token 是字面量 'A'，第 2 个是短语
  // 短语 0x0000：长度 3、距离 1 → 再复制三个 'A'
  let src = lz_bytes([0x05, 0xB0, 0x02, 0x41, 0x00, 0x00])
  let out = @ntfs.decompress(src) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(lz_text(out), "AAAA")
}

///|
test "重叠复制必须逐字节展开" {
  // 字面量 'A' 'B'，然后短语：长度 4、距离 2
  // 逐字节复制得到 ABABAB；若用块拷贝会得到 ABAB 或越界
  let src = lz_bytes([0x06, 0xB0, 0x04, 0x41, 0x42, 0x01, 0x10])
  let out = @ntfs.decompress(src) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(lz_text(out), "ABABAB")
}

///|
test "多块按顺序拼接" {
  let src = lz_bytes([
    0x03, 0x00, 0x61, 0x62, // 未压缩块 "ab"，不是最后一块
     0x03, 0x80, 0x63, 0x64,
  ]) // 未压缩块 "cd"：高字节 0x80 表示最后一块
  let out = @ntfs.decompress(src) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(lz_text(out), "abcd")
}

///|
test "短语回溯越过块起点时报错" {
  // 块内第一个 token 就是短语，前面没有任何输出可回溯
  let src = lz_bytes([0x04, 0xB0, 0x01, 0x00, 0x00])
  let message = try {
    let _ = @ntfs.decompress(src)
    "no error"
  } catch {
    err => @ntfs.describe_error(err)
  }
  assert_true(message.contains("before the chunk start"))
}

///|
test "块长度小于头长度时报错" {
  let src = lz_bytes([0x01, 0x00])
  let message = try {
    let _ = @ntfs.decompress(src)
    "no error"
  } catch {
    err => @ntfs.describe_error(err)
  }
  assert_true(message.contains("length"))
}

///|
test "解压后按上限截断" {
  let src = lz_bytes([0x04, 0x00, 0x61, 0x62, 0x63])
  let out = @ntfs.decompress_to(src, 2) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(out.length(), 2)
  assert_eq(out.at(0).to_int(), 0x61)
  assert_eq(out.at(1).to_int(), 0x62)
}
