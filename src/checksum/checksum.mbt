///|
/// CRC-32/ISO-HDLC（多项式 `0xEDB88320`，初值 `0xFFFFFFFF`，结果取反）。
///
/// GPT 的头校验与分区项校验用的就是这个变体。返回值按无符号 32 位
/// 语义放在 `Int64` 里，避免高位置位时变成负数。
pub fn crc32(bytes : Bytes) -> Int64 {
  let mut crc = 0xFFFFFFFFL
  for i in 0..<bytes.length() {
    crc = crc ^ bytes.at(i).to_int64()
    for _ in 0..<8 {
      if (crc & 1L) == 1L {
        crc = (crc >> 1) ^ 0xEDB88320L
      } else {
        crc = crc >> 1
      }
    }
  }
  crc ^ 0xFFFFFFFFL
}

///|
/// CRC-32/ISCSI（Castagnoli，多项式 `0x82F63B78`）。
///
/// ext4 的元数据校验使用该变体，包括超级块、块组描述符与目录块。
pub fn crc32c(bytes : Bytes) -> Int64 {
  let mut crc = 0xFFFFFFFFL
  for i in 0..<bytes.length() {
    crc = crc ^ bytes.at(i).to_int64()
    for _ in 0..<8 {
      if (crc & 1L) == 1L {
        crc = (crc >> 1) ^ 0x82F63B78L
      } else {
        crc = crc >> 1
      }
    }
  }
  crc ^ 0xFFFFFFFFL
}
