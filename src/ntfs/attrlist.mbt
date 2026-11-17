///|
/// `$ATTRIBUTE_LIST` 的一项。
///
/// 属性的全部内容装不进一条 MFT 记录时，NTFS 会把多出来的部分放进"扩展
/// 记录"，并用 `$ATTRIBUTE_LIST` 串起来。列表本身是常驻属性，每项写明
/// 类型、名字、该段起始 VCN、以及它落在哪条记录的第几号属性上。
pub(all) struct AttrListEntry {
  type_code : Int64
  name : String
  lowest_vcn : Int64
  /// 存放这一段的 MFT 记录号。
  record : Int64
  id : Int64
}

///|
/// 解析 `$ATTRIBUTE_LIST` 的值。
///
/// 每项长度由 `length` 字段给出，**不是固定大小**：带名字的项比不带名字
/// 的长。按固定步长走会从第二项开始全部错位。
pub fn parse_attribute_list(
  value : Bytes,
) -> Array[AttrListEntry] raise NtfsError {
  let out : Array[AttrListEntry] = []
  let size = value.length()
  let mut pos = 0
  while pos + 0x1A <= size {
    let type_code = rd_u32(value, pos)
    let entry_len = rd_u16(value, pos + 0x04).to_int()
    let name_length = rd_u8(value, pos + 0x06).to_int()
    let name_offset = rd_u8(value, pos + 0x07).to_int()
    if entry_len < 0x1A || pos + entry_len > size {
      raise Corrupt(
        reason="$ATTRIBUTE_LIST entry length " +
          entry_len.to_string() +
          " does not fit the list",
      )
    }
    let lowest_vcn = rd_i64(value, pos + 0x08)
    let record = rd_i64(value, pos + 0x10) & 0x0000FFFFFFFFFFFFL
    let id = rd_u16(value, pos + 0x18)
    let name = if name_length == 0 {
      ""
    } else if pos + name_offset + name_length * 2 <= size {
      utf16le_to_string(value, pos + name_offset, name_length * 2)
    } else {
      ""
    }
    out.push({ type_code, name, lowest_vcn, record, id, })
    pos = pos + entry_len
  }
  out
}

///|
/// 把同类型同名的多个段合成一个属性。
///
/// 段之间按 `lowest_vcn` 递增排列，runlist 直接首尾相接——每段的 VCN 已经
/// 是绝对值，接起来就是完整的虚拟簇映射。`data_size` 取各段的最大值：
/// 只有起始段（`lowest_vcn == 0`）的那个才是文件真实长度，其余段可能写 0。
fn combine_extents(extents : Array[Attribute]) -> Attribute {
  let ordered : Array[Attribute] = []
  for e in extents {
    let mut at = ordered.length()
    while at > 0 && ordered[at - 1].lowest_vcn > e.lowest_vcn {
      at = at - 1
    }
    ordered.insert(at, e)
  }
  let proto = ordered[0]
  let runs : Array[Run] = []
  let mut data_size = 0L
  let mut initialized = 0L
  let mut allocated = 0L
  let mut highest = 0L
  for e in ordered {
    for run in e.runs {
      runs.push(run)
    }
    if e.data_size > data_size {
      data_size = e.data_size
    }
    if e.initialized_size > initialized {
      initialized = e.initialized_size
    }
    allocated = allocated + e.allocated_size
    if e.highest_vcn > highest {
      highest = e.highest_vcn
    }
  }
  {
    ..proto,
    lowest_vcn: 0L,
    highest_vcn: highest,
    data_size,
    initialized_size: initialized,
    allocated_size: allocated,
    runs,
  }
}

///|
/// 合并属性集里的多段属性。
fn merge_extents(attrs : Array[Attribute]) -> Array[Attribute] {
  let out : Array[Attribute] = []
  let mut i = 0
  while i < attrs.length() {
    let a = attrs[i]
    // 非起始段已经在起始段那一轮被收走了
    if a.non_resident && a.lowest_vcn > 0L {
      i = i + 1
      continue
    }
    if a.non_resident {
      let extents : Array[Attribute] = [a]
      let mut j = i + 1
      while j < attrs.length() {
        let b = attrs[j]
        if b.non_resident && b.type_code == a.type_code && b.name == a.name {
          extents.push(b)
        }
        j = j + 1
      }
      if extents.length() > 1 {
        out.push(combine_extents(extents))
      } else {
        out.push(a)
      }
    } else {
      out.push(a)
    }
    i = i + 1
  }
  out
}

///|
/// 读一条记录的完整属性集，含 `$ATTRIBUTE_LIST` 指出的扩展记录。
///
/// 这是 `parse_attributes` 之上的封装：单条记录只是属性的一部分，凡是要
/// 拿"文件的全部数据"或"目录的全部索引"的地方都得走这里，否则大文件会
/// 少读后半段、大目录会少列条目——而调用方看不出任何异常。
pub fn load_attributes(
  img : @block.Image,
  vol : Volume,
  mft : Mft,
  number : Int64,
) -> Array[Attribute] raise NtfsError {
  let label = "MFT record " + number.to_string()
  let raw = mft.read_record(img, number)
  let fixed = apply_fixup(raw, vol.bytes_per_sector, label)
  let header = parse_record(fixed)
  let base = parse_attributes(fixed, header.used_size)
  let list = match find_attribute(base, ATTR_ATTRIBUTE_LIST) {
    Some(attr) => attr
    None => return base
  }
  if list.non_resident {
    // 列表本身长到装不下时也会被搬到簇上，一期没实现这一层
    raise Unsupported(feature=label + " has a non-resident $ATTRIBUTE_LIST")
  }
  let entries = parse_attribute_list(list.value)
  let collected : Array[Attribute] = []
  for attr in base {
    collected.push(attr)
  }
  for entry in entries {
    if entry.record == number {
      continue
    }
    // 扩展记录读不出来时不能装作没这回事：跳过会让上层拿到半份属性，
    // 而且看起来一切正常。这里让它以明确的 IO 错误停下。
    let ext_raw = mft.read_record(img, entry.record) catch {
      err =>
        raise Io(
          reason="cannot read extension record " +
            entry.record.to_string() +
            " for " +
            label +
            ": " +
            describe_error(err),
        )
    }
    let ext_label = "MFT record " + entry.record.to_string()
    let ext_fixed = apply_fixup(ext_raw, vol.bytes_per_sector, ext_label)
    let ext_header = parse_record(ext_fixed)
    let ext_attrs = parse_attributes(ext_fixed, ext_header.used_size)
    for attr in ext_attrs {
      if attr.type_code == entry.type_code &&
        attr.id == entry.id &&
        attr.name == entry.name {
        collected.push(attr)
      }
    }
  }
  merge_extents(collected)
}
