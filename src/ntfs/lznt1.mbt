///|
/// LZNT1 解压。
///
/// NTFS 的压缩以"块"为单位：每块 2 字节头，标明长度、是否为压缩块、
/// 是否为最后一块。压缩块内部是一个标志字节加 8 个 token 的循环——
/// 标志位决定该 token 是字面量（1 字节）还是回溯短语（2 字节）。
///
/// 短语编码为 `(length - 3) << 12 | (distance - 1)`：长度 3..18，距离
/// 1..4096。回溯复制**允许与已输出内容重叠**，所以必须逐字节复制；
/// 用一次块拷贝会得到错误结果，这是最常见也最难发现的实现错误。
///
/// 返回 `Array[Byte]` 而不是 `Bytes`，因为解压长度在解压前不可知，
/// 且调用方通常还要按 `data_size` 截断。
pub fn decompress(src : Bytes) -> Array[Byte] raise NtfsError {
  let out : Array[Byte] = []
  let len = src.length()
  let mut pos = 0
  while pos + 2 <= len {
    let header = src.at(pos).to_int() | (src.at(pos + 1).to_int() << 8)
    let chunk_len = (header & 0x0FFF) + 1
    let is_last = (header & 0x8000) != 0
    let is_compressed = (header & 0x7000) == 0x3000
    // 头至少 2 字节 + 至少 1 字节负载，否则长度字段会把循环卡住
    if chunk_len < 3 {
      raise Corrupt(
        reason="LZNT1 chunk declares length " + chunk_len.to_string(),
      )
    }
    if pos + chunk_len > len {
      raise Corrupt(
        reason="LZNT1 chunk at " +
          pos.to_string() +
          " overruns the input buffer",
      )
    }
    if is_compressed {
      decompress_chunk(src, pos + 2, pos + chunk_len, out)
    } else {
      // 未压缩块：负载原样输出。压缩反而变大的数据就走这条分支。
      let mut i = pos + 2
      while i < pos + chunk_len {
        out.push(src.at(i))
        i = i + 1
      }
    }
    pos = pos + chunk_len
    if is_last {
      break
    }
  }
  out
}

///|
/// 解压一个压缩块，结果追加到 `out`。
fn decompress_chunk(
  src : Bytes,
  start : Int32,
  end : Int32,
  out : Array[Byte],
) -> Unit raise NtfsError {
  let chunk_start = out.length()
  let mut pos = start
  while pos < end {
    let flags = src.at(pos).to_int()
    pos = pos + 1
    let mut bit = 0
    while bit < 8 && pos < end {
      if ((flags >> bit) & 1) == 0 {
        out.push(src.at(pos))
        pos = pos + 1
      } else {
        if pos + 1 >= end {
          raise Corrupt(reason="LZNT1 phrase token is truncated")
        }
        let token = src.at(pos).to_int() | (src.at(pos + 1).to_int() << 8)
        pos = pos + 2
        let length = (token >> 12) + 3
        let distance = (token & 0x0FFF) + 1
        if distance > out.length() - chunk_start {
          raise Corrupt(
            reason="LZNT1 phrase points " +
              distance.to_string() +
              " byte(s) back, before the chunk start",
          )
        }
        // 重叠复制：每轮重新计算源位置，所以 distance 小于 length 时
        // 会自然地把刚写入的字节再复制出去
        let mut copied = 0
        while copied < length {
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
  let raw = decompress(src)
  let end = if raw.length() > limit { limit } else { raw.length() }
  let out : FixedArray[Byte] = FixedArray::make(end, Byte::default())
  for i in 0..<end {
    out[i] = raw[i]
  }
  Bytes::from_array(out)
}
