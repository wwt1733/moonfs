///|
const GPT_HEADER_LBA : Int64 = 1

///|
const GPT_HEADER_MIN_SIZE : Int64 = 92

///|
const GPT_ENTRY_MIN_SIZE : Int64 = 128

///|
fn all_zero(bytes : Bytes) -> Bool {
  for i in 0..<bytes.length() {
    if bytes.at(i) != Byte::default() {
      return false
    }
  }
  true
}

///|
/// 把 `[from, to)` 区间清零后返回新缓冲区，用于计算 GPT 头校验和
/// —— 校验和本身存放在这 4 个字节里，计算时必须视为 0。
fn zeroed(bytes : Bytes, from : Int32, to : Int32) -> Bytes {
  let out : FixedArray[Byte] = FixedArray::make(bytes.length(), Byte::default())
  for i in 0..<bytes.length() {
    out[i] = if i >= from && i < to {
      Byte::default()
    } else {
      bytes.at(i)
    }
  }
  Bytes::from_array(out)
}

///|
fn hex_digit(v : Int32) -> String {
  match v {
    0 => "0"
    1 => "1"
    2 => "2"
    3 => "3"
    4 => "4"
    5 => "5"
    6 => "6"
    7 => "7"
    8 => "8"
    9 => "9"
    10 => "a"
    11 => "b"
    12 => "c"
    13 => "d"
    14 => "e"
    _ => "f"
  }
}

///|
fn hex_byte(b : Byte) -> String {
  let v = b.to_int()
  hex_digit((v >> 4) & 0xF) + hex_digit(v & 0xF)
}

///|
/// 按 GPT 的混合端序把 16 字节格式化为标准 GUID 字符串。
///
/// 前三段是小端存放，后两段是字节序，直接按大端拼接会得到反的 GUID。
pub fn guid_to_string(raw : Bytes, off : Int32) -> String raise PartitionError {
  let g = rd_slice(raw, off, 16)
  let mut out = ""
  for i in 0..<4 {
    out = out + hex_byte(g.at(3 - i))
  }
  out = out + "-"
  for i in 0..<2 {
    out = out + hex_byte(g.at(5 - i))
  }
  out = out + "-"
  for i in 0..<2 {
    out = out + hex_byte(g.at(7 - i))
  }
  out = out + "-"
  out = out + hex_byte(g.at(8)) + hex_byte(g.at(9)) + "-"
  for i in 0..<6 {
    out = out + hex_byte(g.at(10 + i))
  }
  out
}

///|
/// 解码 GPT 分区名。
///
/// 字段是 72 字节的 UTF-16LE，遇到第一个 `U+0000` 截止。代理对按标准
/// 合成为一个码点，避免把非 BMP 字符解成两个乱码。
fn utf16le_to_string(raw : Bytes, off : Int32, len : Int32) -> String {
  let chars : Array[Char] = []
  let mut i = 0
  while i + 1 < len {
    let unit = raw.at(off + i).to_int() | (raw.at(off + i + 1).to_int() << 8)
    if unit == 0 {
      break
    }
    if unit >= 0xD800 && unit <= 0xDBFF && i + 3 < len {
      let low = raw.at(off + i + 2).to_int() | (raw.at(off + i + 3).to_int() << 8)
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
/// 解析 GPT 分区表。
///
/// 头与分区项数组都要通过 CRC 校验才继续，否则报 `Corrupt`。校验失败
/// 时返回猜测出来的分区比直接报错更危险：调用方会用它去读错的偏移。
pub fn read_gpt(img : @block.Image) -> Array[Partition] raise PartitionError {
  let sector_size = img.sector_size().to_int64()
  let header = img.read_sector(GPT_HEADER_LBA) catch {
    err => raise Io(reason=io_reason(err))
  }
  if !@binio.starts_with(header, 0, b"EFI PART") {
    raise Corrupt(reason="gpt signature not found in LBA 1")
  }
  let header_size = rd_u32(header, 12)
  if header_size < GPT_HEADER_MIN_SIZE || header_size > sector_size {
    raise Corrupt(reason="gpt header size " + header_size.to_string() + " out of range")
  }
  let stored_crc = rd_u32(header, 16)
  let header_bytes = zeroed(rd_slice(header, 0, header_size.to_int()), 16, 20)
  if @checksum.crc32(header_bytes) != stored_crc {
    raise Corrupt(reason="gpt header crc mismatch")
  }
  let entries_lba = rd_i64(header, 72)
  let num_entries = rd_u32(header, 80)
  let entry_size = rd_u32(header, 84)
  let entries_crc = rd_u32(header, 88)
  if entry_size < GPT_ENTRY_MIN_SIZE {
    raise Corrupt(reason="gpt entry size " + entry_size.to_string() + " is too small")
  }
  let total = num_entries * entry_size
  if total <= 0L || total > 0x7fffffffL {
    raise Corrupt(reason="gpt entry array size " + total.to_string() + " out of range")
  }
  let entries = img.read(entries_lba * sector_size, total.to_int()) catch {
    err => raise Io(reason=io_reason(err))
  }
  if @checksum.crc32(entries) != entries_crc {
    raise Corrupt(reason="gpt entry array crc mismatch")
  }
  let parts : Array[Partition] = []
  let mut idx : Int32 = 0
  while idx.to_int64() < num_entries {
    let base = idx * entry_size.to_int()
    let type_bytes = rd_slice(entries, base, 16)
    if !all_zero(type_bytes) {
      let first_lba = rd_i64(entries, base + 32)
      let last_lba = rd_i64(entries, base + 40)
      parts.push({
        index: idx,
        scheme: Scheme::Gpt,
        mbr_type: 0L,
        type_guid: guid_to_string(entries, base),
        name: utf16le_to_string(entries, base + 56, 72),
        start_lba: first_lba,
        sector_count: last_lba - first_lba + 1L,
        bootable: false,
      })
    }
    idx = idx + 1
  }
  parts
}

///|
/// 读取镜像的分区表。
///
/// 有 GPT 保护性表项时走 GPT，否则按 MBR 解释。
pub fn read(img : @block.Image) -> Array[Partition] raise PartitionError {
  let mbr = read_mbr(img)
  if has_protective_mbr(mbr) {
    read_gpt(img)
  } else {
    mbr
  }
}
