///|
/// MFT 记录头（已修复 USA 之后的视图）。
///
/// 只保留上层真正要用的字段：属性区起点、记录用途、以及这条记录是不是
/// 扩展记录。`lsn` 与 `allocated_size` 之类对只读解析没有作用，不解析，
/// 避免"读了一堆用不上的字段却不知道自己读错没有"。
pub(all) struct RecordHeader {
  /// 序列号。目录索引项里的记录引用是 48 位记录号 + 16 位序列号，
  /// 用来识别"这个引用指向的记录已经被复用"。
  sequence : Int64
  hard_links : Int64
  /// 第一个属性的偏移。
  first_attr : Int32
  /// bit0 = 记录在用，bit1 = 是目录。
  flags : Int64
  /// 记录头 + 属性的有效字节数，属性遍历到此为止。
  used_size : Int64
  /// 非零表示这是 `$ATTRIBUTE_LIST` 引出的扩展记录，属性属于 `base_record`。
  base_record : Int64
  next_attr_id : Int64
}

///|
/// 记录在用标志。
const FLAG_IN_USE : Int64 = 0x0001

///|
/// 记录是目录。
const FLAG_DIRECTORY : Int64 = 0x0002

///|
/// 解析 MFT 记录头。
///
/// 传入的必须是已经过 `apply_fixup` 修复的副本，否则跨扇区字段不可信。
pub fn parse_record(record : Bytes) -> RecordHeader raise NtfsError {
  if !@binio.starts_with(record, 0, b"FILE") {
    // BAAD 是 NTFS 标记坏记录的专用签名，要和"根本不是记录"分开报
    if @binio.starts_with(record, 0, b"BAAD") {
      raise Corrupt(reason="record is marked bad (BAAD signature)")
    }
    raise Corrupt(reason="not an MFT record (signature mismatch)")
  }
  let first_attr = rd_u16(record, 0x14)
  if first_attr < 0x18L || first_attr > record.length().to_int64() {
    raise Corrupt(
      reason="first attribute offset " + first_attr.to_string() + " is invalid",
    )
  }
  {
    sequence: rd_u16(record, 0x10),
    hard_links: rd_u16(record, 0x12),
    first_attr: first_attr.to_int(),
    flags: rd_u16(record, 0x16),
    used_size: rd_u32(record, 0x18),
    base_record: rd_i64(record, 0x20),
    next_attr_id: rd_u16(record, 0x28),
  }
}

///|
/// 记录是否在用。删除的文件会保留记录但清掉这个位。
pub fn RecordHeader::in_use(self : RecordHeader) -> Bool {
  (self.flags & FLAG_IN_USE) != 0L
}

///|
/// 记录是否为目录。
pub fn RecordHeader::is_directory(self : RecordHeader) -> Bool {
  (self.flags & FLAG_DIRECTORY) != 0L
}

///|
/// 是否为 `$ATTRIBUTE_LIST` 引出的扩展记录。
///
/// 扩展记录自己没有 `$FILE_NAME`，它的属性要合并回主记录才能看到全貌。
/// 大文件（分段 `$DATA`）和大目录会遇到这种结构。
pub fn RecordHeader::is_extension(self : RecordHeader) -> Bool {
  self.base_record != 0L
}
