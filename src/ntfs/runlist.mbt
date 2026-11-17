///|
/// runlist 里的一段。NTFS 的文件数据不保证连续，runlist 描述"哪一段
/// 虚拟簇落在哪个实际簇上"。
pub(all) struct Run {
  /// 起始虚拟簇号（VCN）。
  vcn : Int64
  /// 起始逻辑簇号（LCN）；`sparse` 为真时无意义，取 -1。
  lcn : Int64
  clusters : Int64
  /// 稀疏段：这些簇没有分配，读出来必须是零。
  sparse : Bool
}

///|
/// 读 n 字节小端无符号数。
fn read_unsigned_le(data : Bytes, pos : Int32, n : Int32) -> Int64 {
  let mut value = 0L
  for i in 0..<n {
    value = value | (data.at(pos + i).to_int64() << (8 * i))
  }
  value
}

///|
/// 读 n 字节小端**有符号**数。
///
/// runlist 里的 LCN 是相对上一段的增量，必须按有符号解释：文件向后
/// 分配时增量为负，当成无符号会得到一个天文数字的簇号，然后读到镜像
/// 之外或者读到完全无关的数据。
fn read_signed_le(data : Bytes, pos : Int32, n : Int32) -> Int64 {
  let mut value = 0L
  for i in 0..<n {
    value = value | (data.at(pos + i).to_int64() << (8 * i))
  }
  if n < 8 {
    let high = data.at(pos + n - 1).to_int()
    if high >= 0x80 {
      value = value - (1L << (8 * n))
    }
  }
  value
}

///|
/// 解码 runlist。
///
/// 编码格式：每个元素以 1 字节头开始，低 4 位是"长度字段的字节数"，
/// 高 4 位是"偏移字段的字节数"；随后是长度（无符号）与偏移（有符号
/// 增量）。偏移字节数为 0 表示这是一段稀疏区。头部为 0 表示结束。
///
/// `lowest_vcn` 来自属性头：分段存储的属性每一段都带自己的 runlist，
/// VCN 必须从该段声明的起点算起，否则整段会错位。
pub fn parse_runlist(
  data : Bytes,
  offset : Int32,
  lowest_vcn : Int64,
) -> Array[Run] raise NtfsError {
  let out : Array[Run] = []
  let end = data.length()
  let mut pos = offset
  let mut vcn = lowest_vcn
  let mut lcn = 0L
  while pos < end {
    let header = data.at(pos).to_int()
    if header == 0 {
      break
    }
    let len_bytes = header & 0x0F
    let off_bytes = (header >> 4) & 0x0F
    if len_bytes == 0 || len_bytes > 8 || off_bytes > 8 {
      raise Corrupt(
        reason="runlist entry at " + pos.to_string() + " has an invalid header",
      )
    }
    let entry_end = pos + 1 + len_bytes + off_bytes
    if entry_end > end {
      raise Corrupt(
        reason="runlist entry at " + pos.to_string() + " is truncated",
      )
    }
    let clusters = read_unsigned_le(data, pos + 1, len_bytes)
    if clusters <= 0L {
      raise Corrupt(reason="runlist entry declares zero clusters")
    }
    if off_bytes == 0 {
      // 稀疏段：不消耗实际簇，但占用 VCN 空间
      out.push({ vcn, lcn: -1L, clusters, sparse: true, })
    } else {
      let delta = read_signed_le(data, pos + 1 + len_bytes, off_bytes)
      lcn = lcn + delta
      if lcn < 0L {
        raise Corrupt(reason="runlist resolves to a negative cluster number")
      }
      out.push({ vcn, lcn, clusters, sparse: false, })
    }
    vcn = vcn + clusters
    pos = entry_end
  }
  out
}

///|
/// 从属性里取出 runlist。
pub fn runlist_of(attr : Attribute) -> Array[Run] {
  attr.runs
}

///|
/// runlist 覆盖的总簇数。
pub fn total_clusters(runs : Array[Run]) -> Int64 {
  let mut total = 0L
  for run in runs {
    total = total + run.clusters
  }
  total
}

///|
/// runlist 真正占用的物理簇数：稀疏段不计。
///
/// 和 `total_clusters` 的区别在稀疏与压缩文件上才看得出来——那些文件的
/// 虚拟跨度远大于实际占用。
pub fn allocated_clusters(runs : Array[Run]) -> Int64 {
  let mut total = 0L
  for run in runs {
    if !run.sparse {
      total = total + run.clusters
    }
  }
  total
}

///|
/// 在 runlist 里查某个虚拟簇落在哪。
///
/// 返回 `None` 表示该 VCN 超出 runlist 覆盖范围；返回 `Some(None)` 表示
/// 该 VCN 落在稀疏段（应读作零）。这种双层 Option 有点绕，但比用
/// 魔法值 -1 表示稀疏更安全——魔法值迟早会和真实的 LCN 0 混淆。
pub fn lookup_cluster(runs : Array[Run], vcn : Int64) -> Int64?? {
  for run in runs {
    if vcn >= run.vcn && vcn < run.vcn + run.clusters {
      if run.sparse {
        return Some(None)
      }
      return Some(Some(run.lcn + (vcn - run.vcn)))
    }
  }
  None
}
