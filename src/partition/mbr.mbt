///|
/// 分区表解析错误。
pub suberror PartitionError {
  /// 底层镜像读取失败。
  Io(reason~ : String)
  /// 扇区 0 末尾没有 `0x55AA` 签名，不是 MBR 结构。
  BadSignature(found~ : Int64)
  /// 结构存在但内容不自洽。
  Corrupt(reason~ : String)
}

///|
/// 分区表类型。
pub(all) enum Scheme {
  Mbr
  Gpt
}

///|
/// 一个分区。
///
/// `mbr_type` 只在 MBR 下有意义，`type_guid` / `name` 只在 GPT 下有意义。
/// 不用可选字段堆在一起，是为了让 CLI 输出和测试断言都能直接取用。
pub(all) struct Partition {
  index : Int32
  scheme : Scheme
  mbr_type : Int64
  type_guid : String
  name : String
  start_lba : Int64
  sector_count : Int64
  bootable : Bool
}

///|
pub fn Partition::end_lba(self : Partition) -> Int64 {
  self.start_lba + self.sector_count - 1L
}

///|
fn io_reason(err : @block.BlockError) -> String {
  match err {
    OutOfBounds(offset~, need~, size~) =>
      "need " +
      need.to_string() +
      " byte(s) at " +
      offset.to_string() +
      ", image is " +
      size.to_string() +
      " byte(s)"
    InvalidSectorSize(size~) => "invalid sector size " + size.to_string()
  }
}

///|
fn rd_u8(buf : Bytes, off : Int32) -> Int64 raise PartitionError {
  @binio.u8(buf, off) catch {
    _ => raise Corrupt(reason="field read out of range at " + off.to_string())
  }
}

///|
fn rd_u16(buf : Bytes, off : Int32) -> Int64 raise PartitionError {
  @binio.u16le(buf, off) catch {
    _ => raise Corrupt(reason="field read out of range at " + off.to_string())
  }
}

///|
fn rd_u32(buf : Bytes, off : Int32) -> Int64 raise PartitionError {
  @binio.u32le(buf, off) catch {
    _ => raise Corrupt(reason="field read out of range at " + off.to_string())
  }
}

///|
fn rd_i64(buf : Bytes, off : Int32) -> Int64 raise PartitionError {
  @binio.i64le(buf, off) catch {
    _ => raise Corrupt(reason="field read out of range at " + off.to_string())
  }
}

///|
fn rd_slice(buf : Bytes, off : Int32, len : Int32) -> Bytes raise PartitionError {
  @binio.slice(buf, off, len) catch {
    _ => raise Corrupt(reason="field read out of range at " + off.to_string())
  }
}

///|
/// MBR 分区表项固定位于扇区 0 的 0x1BE，共 4 项，每项 16 字节。
const MBR_ENTRY_BASE : Int32 = 446

///|
/// 解析 MBR 分区表。
///
/// 只返回类型非 0 且扇区数非 0 的表项；类型 `0xEE` 的保护性表项也保留，
/// 由调用方决定是否改走 GPT 路径。
pub fn read_mbr(img : @block.Image) -> Array[Partition] raise PartitionError {
  let sector = img.read_sector(0L) catch {
    err => raise Io(reason=io_reason(err))
  }
  parse_mbr_sector(sector)
}

///|
fn parse_mbr_sector(sector : Bytes) -> Array[Partition] raise PartitionError {
  let signature = rd_u16(sector, 510)
  if signature != 0xAA55L {
    raise BadSignature(found=signature)
  }
  let parts : Array[Partition] = []
  for i in 0..<4 {
    let base = MBR_ENTRY_BASE + i * 16
    let status = rd_u8(sector, base)
    let type_byte = rd_u8(sector, base + 4)
    let start = rd_u32(sector, base + 8)
    let count = rd_u32(sector, base + 12)
    if type_byte != 0L && count != 0L {
      parts.push({
        index: i,
        scheme: Scheme::Mbr,
        mbr_type: type_byte,
        type_guid: "",
        name: "",
        start_lba: start,
        sector_count: count,
        bootable: status == 0x80L,
      })
    }
  }
  parts
}

///|
/// 判断 MBR 表项里是否存在 GPT 保护性分区（类型 `0xEE`）。
pub fn has_protective_mbr(parts : Array[Partition]) -> Bool {
  for part in parts {
    if part.mbr_type == 0xEEL {
      return true
    }
  }
  false
}
