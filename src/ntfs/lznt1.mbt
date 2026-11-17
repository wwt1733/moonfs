///|
/// LZNT1 解压。
///
/// NTFS 的压缩以"块"为单位：每块 2 字节头，随后是标志字节加 8 个 token
/// 的循环——标志位决定该 token 是字面量（1 字节）还是回溯短语（2 字节）。
/// 一个块最多还原 4096 字节。
///
/// 短语的 16 位编码**不是固定分栏**：长度占低 `16-d` 位、距离占高 `d`
/// 位，而 `d` 随块内已产出的长度变化——`d = max(4, ceil(log2(pos)))`。
/// 也就是说块开头（pos < 16）用 12 位长度 + 4 位距离，越往后距离位越多、
/// 长度位越少。把分栏写死成 4/12 会在真实数据上立刻失败：Windows 生成的
/// 块在前 16 字节之后就换用更宽的距离。
///
/// 距离是 `(高 d 位) + 1`，回溯复制**允许与已输出内容重叠**，所以必须
/// 逐字节复制；用一次块拷贝会得到错误结果。
///
/// `limit` 是这一块压缩数据的预期输出上限（一个压缩单元的字节数）。
/// 必须显式给出而不是靠输入耗尽来判断结束：NTFS 按簇分配，一个压缩单元
/// 的最后一次分配里通常还带着填充字节，读到那里会解出多余的垃圾。
pub fn decompress(src : Bytes, limit : Int32) -> Array[Byte] raise NtfsError {
  let out : Array[Byte] = []
  let len = src.length()
  let mut pos = 0
  while pos + 2 <= len && out.length() < limit {
    let header = src.at(pos).to_int() | (src.at(pos + 1).to_int() << 8)
    // 低 12 位是负载长度（不含 2 字节块头），不是整块长度
    let payload_len = (header & 0x0FFF) + 1
    let is_compressed = (header & 0x8000) != 0
    if payload_len < 1 {
      raise Corrupt(
        reason="LZNT1 chunk declares length " + payload_len.to_string(),
      )
    }
    if pos + 2 + payload_len > len {
      raise Corrupt(
        reason="LZNT1 chunk at " +
          pos.to_string() +
          " overruns the input buffer",
      )
    }
    if is_compressed {
      decompress_chunk(src, pos + 2, pos + 2 + payload_len, out, limit)
    } else {
      // 未压缩块：负载原样输出。压缩反而变大的数据就走这条分支。
      let mut i = pos + 2
      while i < pos + 2 + payload_len {
        out.push(src.at(i))
        i = i + 1
      }
    }
    pos = pos + 2 + payload_len
  }
  out
}

///|
/// 块内已产出 `pos` 字节时，短语里距离字段的位宽。
///
/// 距离上限是"不小于当前已产出长度的最小 2 的幂"，最少 4 位（距离上限
/// 16）。这个结论来自用 Windows 自己生成的压缩块做对照：`pos = 48` 与
/// `pos = 64` 都必须用 6 位，`pos = 1058` 必须用 11 位。
fn displacement_bits(pos : Int32) -> Int32 {
  let mut bits = 0
  let mut span = 1
  while span < pos {
    span = span * 2
    bits = bits + 1
  }
  if bits < 4 {
    4
  } else {
    bits
  }
}

///|
/// 解压一个压缩块，结果追加到 `out`。
fn decompress_chunk(
  src : Bytes,
  start : Int32,
  end : Int32,
  out : Array[Byte],
  limit : Int32,
) -> Unit raise NtfsError {
  let chunk_start = out.length()
  let mut pos = start
  while pos < end && out.length() < limit {
    let flags = src.at(pos).to_int()
    pos = pos + 1
    let mut bit = 0
    while bit < 8 && pos < end && out.length() < limit {
      if ((flags >> bit) & 1) == 0 {
        out.push(src.at(pos))
        pos = pos + 1
      } else {
        if pos + 1 >= end {
          raise Corrupt(reason="LZNT1 phrase token is truncated")
        }
        let token = src.at(pos).to_int() | (src.at(pos + 1).to_int() << 8)
        pos = pos + 2
        let in_chunk = out.length() - chunk_start
        let split = 16 - displacement_bits(in_chunk)
        let length = (token & ((1 << split) - 1)) + 3
        let distance = (token >> split) + 1
        if distance > in_chunk {
          raise Corrupt(
            reason="LZNT1 phrase points " +
              distance.to_string() +
              " byte(s) back, before the chunk start",
          )
        }
        // 重叠复制：每轮重新计算源位置，所以 distance 小于 length 时
        // 会自然地把刚写入的字节再复制出去
        let mut copied = 0
        while copied < length && out.length() < limit {
          let from = out.length() - distance
          out.push(out[from])
          copied = copied + 1
        }
      }
      bit = bit + 1
    }
  }
}

///|
/// 解压并按 `limit` 截断。
pub fn decompress_to(src : Bytes, limit : Int32) -> Bytes raise NtfsError {
  let raw = decompress(src, limit)
  let end = if raw.length() > limit { limit } else { raw.length() }
  let out : FixedArray[Byte] = FixedArray::make(end, Byte::default())
  for i in 0..<end {
    out[i] = raw[i]
  }
  Bytes::from_array(out)
}
