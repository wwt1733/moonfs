///|
/// 属性类型常量。NTFS 用这些值区分属性种类，名字前缀都是 `$`。
pub const ATTR_STANDARD_INFORMATION : Int64 = 0x10
pub const ATTR_ATTRIBUTE_LIST : Int64 = 0x20
pub const ATTR_FILE_NAME : Int64 = 0x30
pub const ATTR_OBJECT_ID : Int64 = 0x40
pub const ATTR_SECURITY_DESCRIPTOR : Int64 = 0x50
pub const ATTR_VOLUME_NAME : Int64 = 0x60
pub const ATTR_VOLUME_INFORMATION : Int64 = 0x70
pub const ATTR_DATA : Int64 = 0x80
pub const ATTR_INDEX_ROOT : Int64 = 0x90
pub const ATTR_INDEX_ALLOCATION : Int64 = 0xA0
pub const ATTR_BITMAP : Int64 = 0xB0
pub const ATTR_REPARSE_POINT : Int64 = 0xC0
pub const ATTR_EA_INFORMATION : Int64 = 0xD0
pub const ATTR_EA : Int64 = 0xE0

///|
/// 属性头里的标志位。
pub const ATTR_FLAG_COMPRESSED : Int64 = 0x0001
pub const ATTR_FLAG_ENCRYPTED : Int64 = 0x4000
pub const ATTR_FLAG_SPARSE : Int64 = 0x8000

///|
/// 一个已解析的属性头。
///
/// `value` 只在常驻属性里有内容；非常驻属性的数据在卷上，要通过
/// `runlist` 定位。
pub(all) struct Attribute {
  type_code : Int64
  /// 属性占用的总字节数（含头与名字，已按 8 字节对齐）。遍历时用它前进。
  total_length : Int32
  non_resident : Bool
  /// 属性的名字。多数属性无名，`$DATA` 的命名实例对应备用数据流（ADS）。
  name : String
  flags : Int64
  id : Int64
  /// 常驻属性的值；非常驻时为空。
  value : Bytes
  lowest_vcn : Int64
  highest_vcn : Int64
  /// runlist 相对属性起点的偏移。
  runlist_offset : Int32
  /// 压缩单元的 log2(簇数)。0 表示该属性不参与压缩。
  compression_unit : Int32
  allocated_size : Int64
  data_size : Int64
  initialized_size : Int64
}

///|
/// UTF-16LE 解码。
///
/// `len` 是字节数而不是字符数——NTFS 里名字长度字段记的是 UTF-16 码元数，
/// 调用时要乘 2，忘记乘就会把名字截断一半。
fn utf16le_to_string(raw : Bytes, off : Int32, len : Int32) -> String {
  let chars : Array[Char] = []
  let mut i = 0
  while i + 1 < len {
    let unit = raw.at(off + i).to_int() | (raw.at(off + i + 1).to_int() << 8)
    if unit == 0 {
      break
    }
    if unit >= 0xD800 && unit <= 0xDBFF && i + 3 < len {
      let low = raw.at(off + i + 2).to_int() |
        (raw.at(off + i + 3).to_int() << 8)
      if low >= 0xDC00 && low <= 0xDFFF {
        let code = 0x10000 + ((unit - 0xD800) << 10) + (low - 0xDC00)
        if code.to_char() is Some(c) {
          chars.push(c)
        }
        i = i + 4
        continue
      }
    }
    if unit.to_char() is Some(c) {
      chars.push(c)
    }
    i = i + 2
  }
  String::from_array(chars)
}

///|
/// 解析记录里的全部属性。
///
/// `limit` 传入记录头的 `used_size`。属性链靠 `0xFFFFFFFF` 终止，但真正
/// 可信的边界是 `used_size`——记录尾部可能有上一版留下的残渣，越过
/// `used_size` 去读会把垃圾当成属性。
pub fn parse_attributes(
  record : Bytes,
  limit : Int64,
) -> Array[Attribute] raise NtfsError {
  let out : Array[Attribute] = []
  let mut off = rd_u16(record, 0x14).to_int()
  let record_end = record.length()
  let mut end = limit.to_int()
  if end <= 0 || end > record_end {
    end = record_end
  }
  while off + 8 <= end {
    let type_code = rd_u32(record, off)
    // 0xFFFFFFFF 是链结束标记；0 是全零填充（记录尾部的空闲空间）
    if type_code == 0xFFFFFFFFL || type_code == 0L {
      break
    }
    let length = rd_u32(record, (off + 4))
    if length < 0x18L {
      raise Corrupt(
        reason="attribute at " + off.to_string() + " declares length " +
        length.to_string(),
      )
    }
    if off.to_int64() + length > end.to_int64() {
      raise Corrupt(
        reason="attribute at " +
        off.to_string() +
        " overruns the record's used size",
      )
    }
    out.push(parse_attribute(record, off, type_code, length.to_int()))
    off = off + length.to_int()
  }
  out
}

///|
/// 解析单个属性头。
fn parse_attribute(
  record : Bytes,
  off : Int32,
  type_code : Int64,
  total_length : Int32,
) -> Attribute raise NtfsError {
  let non_resident = rd_u8(record, off + 0x08) != 0L
  let name_length = rd_u8(record, (off + 0x09)).to_int()
  let name_offset = rd_u16(record, (off + 0x0A)).to_int()
  let flags = rd_u16(record, (off + 0x0C))
  let id = rd_u16(record, (off + 0x0E))
  let name = if name_length == 0 {
    ""
  } else {
    let start = off + name_offset
    if start + name_length * 2 > off + total_length {
      raise Corrupt(reason="attribute name runs past the attribute end")
    }
    utf16le_to_string(record, start, name_length * 2)
  }
  if non_resident {
    let lowest_vcn = rd_i64(record, (off + 0x10))
    let highest_vcn = rd_i64(record, (off + 0x18))
    let runlist_offset = rd_u16(record, (off + 0x20))
    let compression_unit = rd_u16(record, (off + 0x22))
    let allocated_size = rd_i64(record, (off + 0x28))
    let data_size = rd_i64(record, (off + 0x30))
    let initialized_size = rd_i64(record, (off + 0x38))
    if lowest_vcn < 0L || highest_vcn < lowest_vcn {
      raise Corrupt(
        reason="attribute VCN range " +
        lowest_vcn.to_string() +
        ".." +
        highest_vcn.to_string(),
      )
    }
    {
      type_code,
      total_length,
      non_resident,
      name,
      flags,
      id,
      value: Default::default(),
      lowest_vcn,
      highest_vcn,
      runlist_offset: runlist_offset.to_int(),
      compression_unit: compression_unit.to_int(),
      allocated_size,
      data_size,
      initialized_size,
    }
  } else {
    let value_length = rd_u32(record, (off + 0x10))
    let value_offset = rd_u16(record, (off + 0x14))
    if value_offset < 0L ||
      value_offset + value_length > total_length.to_int64() {
      raise Corrupt(reason="resident value runs past the attribute end")
    }
    let value = if value_length == 0L {
      Default::default()
    } else {
      @binio.slice(
        record,
        off + value_offset.to_int(),
        value_length.to_int(),
      ) catch {
        _ => raise Corrupt(reason="cannot read resident value")
      }
    }
    {
      type_code,
      total_length,
      non_resident,
      name,
      flags,
      id,
      value,
      lowest_vcn: 0L,
      highest_vcn: 0L,
      runlist_offset: 0,
      compression_unit: 0,
      allocated_size: value_length,
      data_size: value_length,
      initialized_size: value_length,
    }
  }
}

///|
/// 属性是否被压缩。
pub fn Attribute::is_compressed(self : Attribute) -> Bool {
  (self.flags & ATTR_FLAG_COMPRESSED) != 0L
}

///|
/// 属性是否被 EFS 加密。
pub fn Attribute::is_encrypted(self : Attribute) -> Bool {
  (self.flags & ATTR_FLAG_ENCRYPTED) != 0L
}

///|
/// 属性是否为稀疏。
pub fn Attribute::is_sparse(self : Attribute) -> Bool {
  (self.flags & ATTR_FLAG_SPARSE) != 0L
}

///|
/// 找第一个指定类型的属性。
pub fn find_attribute(
  attrs : Array[Attribute],
  type_code : Int64,
) -> Attribute? {
  for attr in attrs {
    if attr.type_code == type_code {
      return Some(attr)
    }
  }
  None
}

///|
/// 找指定类型且有指定名字的属性。
///
/// `$DATA` 的命名实例对应备用数据流；调用方传空字符串即可拿默认流。
pub fn find_named_attribute(
  attrs : Array[Attribute],
  type_code : Int64,
  name : String,
) -> Attribute? {
  for attr in attrs {
    if attr.type_code == type_code && attr.name == name {
      return Some(attr)
    }
  }
  None
}

///|
/// `$FILE_NAME` 属性解析结果。
pub(all) struct FileName {
  parent_record : Int64
  parent_sequence : Int64
  created : Int64
  modified : Int64
  accessed : Int64
  logical_size : Int64
  allocated_size : Int64
  flags : Int64
  /// 文件名，已按命名空间挑选过。
  name : String
  /// 命名空间：0 = POSIX，1 = Win32，2 = DOS（8.3 短名），3 = Win32&DOS。
  name_ns : Int32
}

///|
/// 解析 `$FILE_NAME` 的值。
///
/// 时间字段是 FILETIME（1601-01-01 起的 100ns 计数），这里原样返回，
/// 由上层决定怎么格式化——不要在解析层就转成字符串，否则不同后端
/// 的时区处理会让输出不一致。
pub fn parse_file_name(value : Bytes) -> FileName raise NtfsError {
  if value.length() < 0x42 {
    raise Corrupt(reason="file name attribute is too short")
  }
  let name_length = rd_u8(value, 0x40).to_int()
  if 0x42 + name_length * 2 > value.length() {
    raise Corrupt(reason="file name runs past the attribute value")
  }
  let parent = rd_i64(value, 0)
  {
    parent_record: parent & 0x0000FFFFFFFFFFFFL,
    parent_sequence: (parent >> 48) & 0xFFFFL,
    created: rd_i64(value, 0x08),
    modified: rd_i64(value, 0x10),
    accessed: rd_i64(value, 0x20),
    logical_size: rd_i64(value, 0x30),
    allocated_size: rd_i64(value, 0x28),
    flags: rd_u32(value, 0x38),
    name: utf16le_to_string(value, 0x42, name_length * 2),
    name_ns: rd_u8(value, 0x41).to_int(),
  }
}

///|
/// 从多个 `$FILE_NAME` 里选出用于展示的那个。
///
/// 同一文件通常有两个名字：Win32 长名和 DOS 8.3 短名。目录枚举必须选
/// 长名，否则用户会看到 `PROGRA~1` 这种短名混在结果里。命名空间取值
/// 3 表示长名与短名恰好相同，优先取它以避免重复。
pub fn pick_display_name(names : Array[FileName]) -> FileName? {
  let mut best : FileName? = None
  for name in names {
    if name.name_ns == 1 || name.name_ns == 3 {
      return Some(name)
    }
    if best is None && (name.name_ns == 0) {
      best = Some(name)
    }
  }
  if best is Some(_) {
    return best
  }
  if names.length() > 0 {
    return Some(names[0])
  }
  None
}

///|
/// 卷版本（来自 `$VOLUME_INFORMATION`）。
pub(all) struct VolumeVersion {
  major : Int32
  minor : Int32
  /// `$VOLUME_INFORMATION` 的 flags，bit0 表示卷被置为脏。
  flags : Int64
}

///|
/// 解析 `$VOLUME_INFORMATION`。
pub fn parse_volume_information(value : Bytes) -> VolumeVersion raise NtfsError {
  if value.length() < 12 {
    raise Corrupt(reason="volume information attribute is too short")
  }
  {
    major: rd_u8(value, 0x08).to_int(),
    minor: rd_u8(value, 0x09).to_int(),
    flags: rd_u16(value, 0x0A),
  }
}
