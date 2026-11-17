///|
/// Update Sequence Array（USA）修复。
///
/// NTFS 在每条记录（MFT 记录、`INDX` 索引块）的**每个扇区**末尾写入同一个
/// 更新序列号（USN），该扇区真实的最后两字节被搬到记录头部的 USA 数组里。
/// 目的是检测撕裂写：如果断电导致某个扇区只写了一半，末尾那两字节就不是
/// 预期值，修复时立刻能发现。
///
/// 这一步必须在任何字段解析之前做。不修复就直接读，所有跨越扇区边界的
/// 字段——包括属性长度和 runlist——都会是错值，表现为后续遍历突然跑飞，
/// 而错误现场离真正的原因很远。
///
/// `sector_size` 是卷的扇区大小，`label` 只用于错误信息（区分是 MFT 记录
/// 还是索引块，两者修复逻辑相同但排错时需要知道来源）。
pub fn apply_fixup(
  record : Bytes,
  sector_size : Int32,
  label : String,
) -> Bytes raise NtfsError {
  let len = record.length()
  // 记录头至少要到 0x30 才能容纳签名、USA 指针和属性区偏移
  if len < 0x30 {
    raise Corrupt(
      reason=label + ": record too short (" + len.to_string() + " bytes)",
    )
  }
  if sector_size <= 0 || len % sector_size != 0 {
    raise Corrupt(
      reason=label +
        ": size " +
        len.to_string() +
        " is not a multiple of sector size " +
        sector_size.to_string(),
    )
  }
  let usa_offset = rd_u16(record, 0x04).to_int()
  let usa_count = rd_u16(record, 0x06).to_int()
  let sectors = len / sector_size
  // USA 存的是 USN 加上每个扇区末尾的两字节，所以数量恒为扇区数 + 1
  if usa_count != sectors + 1 {
    raise Corrupt(
      reason=label +
        ": update sequence count " +
        usa_count.to_string() +
        " does not match " +
        sectors.to_string() +
        " sector(s)",
    )
  }
  if usa_offset < 0 || usa_offset + usa_count * 2 > len {
    raise Corrupt(
      reason=label +
        ": update sequence array at " +
        usa_offset.to_string() +
        " is out of range",
    )
  }
  let out : FixedArray[Byte] = FixedArray::make(len, Byte::default())
  for i in 0..<len {
    out[i] = record.at(i)
  }
  let usn_lo = out[usa_offset]
  let usn_hi = out[usa_offset + 1]
  for i in 1..<usa_count {
    let tail = i * sector_size - 2
    if out[tail] != usn_lo || out[tail + 1] != usn_hi {
      raise Corrupt(
        reason=label +
          ": update sequence mismatch at end of sector " +
          i.to_string() +
          " (torn write)",
      )
    }
    out[tail] = out[usa_offset + i * 2]
    out[tail + 1] = out[usa_offset + i * 2 + 1]
  }
  Bytes::from_array(out)
}
