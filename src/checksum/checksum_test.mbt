///|
test "crc32 matches the standard check vector" {
  // "123456789" -> 0xCBF43926
  assert_eq(@checksum.crc32(b"123456789"), 0xCBF43926L)
}

///|
test "crc32 of empty input is zero" {
  assert_eq(@checksum.crc32(b""), 0L)
}

///|
test "crc32c matches the standard check vector" {
  // "123456789" -> 0xE3069283
  assert_eq(@checksum.crc32c(b"123456789"), 0xE3069283L)
}
