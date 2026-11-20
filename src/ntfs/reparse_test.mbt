///|
/// 造一个目录联接（junction）的 `$REPARSE_POINT` 值。
///
/// 关键差别：mount point 的路径缓冲区从 0x10 开始，符号链接前面多 4 字节
/// flags，从 0x14 开始。用错基址读出来的就是半个汉字或者一截乱码。
fn mount_point_value() -> Bytes {
  let sub_len = 14 // \??\D:\ 的 UTF-16LE 长度
  let prn_len = 6 // D:\
  let arr = nb_zero(0x10 + sub_len + prn_len)
  nb_u16le(arr, 0x00, 0x0003) // tag 低半
  nb_u16le(arr, 0x02, 0xA000) // tag 高半 => 0xA0000003
  nb_u16le(arr, 0x04, (8 + sub_len + prn_len).to_int64())
  nb_u16le(arr, 0x08, 0) // substitute offset
  nb_u16le(arr, 0x0A, sub_len.to_int64())
  nb_u16le(arr, 0x0C, sub_len.to_int64()) // print offset
  nb_u16le(arr, 0x0E, prn_len.to_int64())
  let tail : Bytes = b"\x5c\x00\x3f\x00\x3f\x00\x5c\x00\x44\x00\x3a\x00\x5c\x00\x44\x00\x3a\x00\x5c\x00"
  for i in 0..<tail.length() {
    arr[0x10 + i] = tail.at(i)
  }
  Bytes::from_array(arr)
}

///|
test "重解析点：mount point 的路径缓冲区从 0x10 开始" {
  let value = mount_point_value()
  let point = @ntfs.parse_reparse_point(value) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(point.kind, "mount-point")
  assert_eq(point.substitute, "\\??\\D:\\")
  assert_eq(point.print_name, "D:\\")
}

///|
test "重解析点：未知 tag 不猜测，原样交回" {
  let arr = nb_zero(16)
  nb_u16le(arr, 0x00, 0x0001)
  nb_u16le(arr, 0x02, 0x9000) // 0x90000001，不是本仓库认识的类型
  nb_u16le(arr, 0x04, 8)
  let point = @ntfs.parse_reparse_point(Bytes::from_array(arr)) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(point.kind, "other")
  assert_eq(point.print_name, "")
}
