///|
test "u16le decodes little endian" {
  let buf = b"\x01\x02"
  assert_eq(@binio.u16le(buf, 0), 0x0201L)
}

///|
test "u16be decodes big endian" {
  let buf = b"\x01\x02"
  assert_eq(@binio.u16be(buf, 0), 0x0102L)
}

///|
test "u32le decodes four bytes" {
  let buf = b"\x78\x56\x34\x12"
  assert_eq(@binio.u32le(buf, 0), 0x12345678L)
}

///|
test "u32le keeps values above int32 range unsigned" {
  let buf = b"\xff\xff\xff\xff"
  assert_eq(@binio.u32le(buf, 0), 0xffffffffL)
}

///|
test "i64le decodes negative values" {
  let buf = b"\xff\xff\xff\xff\xff\xff\xff\xff"
  assert_eq(@binio.i64le(buf, 0), -1L)
}

///|
test "i64le decodes positive values" {
  let buf = b"\x01\x00\x00\x00\x00\x00\x00\x00"
  assert_eq(@binio.i64le(buf, 0), 1L)
}

///|
test "reads past the end are rejected instead of truncated" {
  let buf = b"\x01\x02"
  let result = try Ok(@binio.u32le(buf, 0)) catch { e => Err(e) }
  assert_true(result is Err(_))
}

///|
test "negative offset is rejected" {
  let buf = b"\x01\x02"
  let result = try Ok(@binio.u8(buf, -1)) catch { e => Err(e) }
  assert_true(result is Err(_))
}

///|
test "slice copies the requested window" {
  let buf = b"\x00\x01\x02\x03\x04"
  assert_eq(@binio.slice(buf, 1, 3), b"\x01\x02\x03")
}

///|
test "starts_with compares a prefix" {
  let buf = b"\x4e\x54\x46\x53\x00"
  assert_true(@binio.starts_with(buf, 0, b"NTFS"))
  assert_false(@binio.starts_with(buf, 1, b"NTFS"))
}
