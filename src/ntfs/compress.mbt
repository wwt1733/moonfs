///|
/// 读取被 NTFS 压缩层包装的数据。
///
/// NTFS 按"压缩单元"处理：一个单元通常是 `2^compression_unit` 个簇
/// （常见 16 簇 = 64 KiB）。单元内只有三种可能，必须分别处理：
///
/// 1. **整单元未分配**（runlist 里是稀疏段）——内容全是零。
///    压缩随机数据或全零数据时，NTFS 干脆不分配。
/// 2. **原样存储**——单元占用的字节数正好等于未压缩大小。
///    压缩后反而变大时 NTFS 直接存原文，这一段没有 LZNT1 头。
/// 3. **需要解压**——其余情况，对收集到的字节做 LZNT1 解压。
///
/// 第 2 种最容易被漏掉，漏掉就会把原始数据当 LZNT1 解，输出一片垃圾
/// 却不会报错——这是压缩实现里最隐蔽的 bug。
pub fn read_compressed(
  img : @block.Image,
  vol : Volume,
  attr : Attribute,
  runs : Array[Run],
) -> Bytes raise NtfsError {
  let unit_clusters = if attr.compression_unit <= 0 {
    1L
  } else {
    1L << attr.compression_unit
  }
  let cluster = vol.cluster_size.to_int64()
  let unit_bytes = unit_clusters * cluster
  let total = attr.data_size
  if total <= 0L {
    return Default::default()
  }
  let out : Array[Byte] = []
  let mut unit = 0L
  while unit * unit_bytes < total {
    let start_vcn = unit * unit_clusters
    let end_vcn = start_vcn + unit_clusters
    let collected = collect_unit(
      img,
      vol.base_offset,
      cluster,
      runs,
      start_vcn,
      end_vcn,
    )
    let remain = total - unit * unit_bytes
    let want = if remain > unit_bytes { unit_bytes } else { remain }
    let want_len = want.to_int()
    if collected.length() == 0 {
      // 情形 1：整单元稀疏，全部是零
      let mut i = 0
      while i < want_len {
        out.push(Byte::default())
        i = i + 1
      }
    } else if collected.length().to_int64() == unit_bytes {
      // 情形 2：原样存储，没有 LZNT1 头
      let mut i = 0
      while i < want_len && i < collected.length() {
        out.push(collected[i])
        i = i + 1
      }
    } else {
      // 情形 3：解压。上限给一个完整单元，最后一块可能不足一个单元，
      // 因此按 want 截断
      let raw = decompress(Bytes::from_array(collected), unit_bytes.to_int()) catch {
        err =>
          raise Corrupt(
            reason="cannot decompress the unit at VCN " +
              start_vcn.to_string() +
              ": " +
              describe_error(err),
          )
      }
      let mut i = 0
      while i < want_len && i < raw.length() {
        out.push(raw[i])
        i = i + 1
      }
      // 解压结果不足一个单元时补零：只有镜像被截断才会发生，
      // 补零让调用方看到"内容不完整"，而不是读越界崩溃
      while i < want_len {
        out.push(Byte::default())
        i = i + 1
      }
    }
    unit = unit + 1L
  }
  Bytes::from_array(out)
}

///|
/// 收集一个压缩单元内所有**实际分配**的字节，按 VCN 顺序拼接。
///
/// 稀疏段被跳过：它的语义是"这部分没有数据"，不是"这部分是零"，两者
/// 的区别在于拼接后是否参与 LZNT1 解压。
fn collect_unit(
  img : @block.Image,
  base_offset : Int64,
  cluster_size : Int64,
  runs : Array[Run],
  start_vcn : Int64,
  end_vcn : Int64,
) -> Array[Byte] raise NtfsError {
  let out : Array[Byte] = []
  for run in runs {
    let run_end = run.vcn + run.clusters
    if run_end <= start_vcn || run.vcn >= end_vcn {
      continue
    }
    if run.sparse {
      continue
    }
    let from = if run.vcn > start_vcn { run.vcn } else { start_vcn }
    let to = if run_end < end_vcn { run_end } else { end_vcn }
    let count = to - from
    let lcn = run.lcn + (from - run.vcn)
    let bytes = img.read(
      base_offset + lcn * cluster_size,
      (count * cluster_size).to_int(),
    ) catch {
      err =>
        raise Io(reason="cannot read compressed unit: " + @block.reason_of(err))
    }
    for i in 0..<bytes.length() {
      out.push(bytes.at(i))
    }
  }
  out
}
