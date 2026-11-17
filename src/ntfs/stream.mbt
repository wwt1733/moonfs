///|
/// 读取一个属性的全部内容。
///
/// 常驻属性直接返回内嵌值；非常驻走 runlist；被压缩的交给压缩层；
/// 被 EFS 加密的明确报错而不是返回密文——返回密文会让调用方以为
/// "读到了内容"，而实际拿到的是不可解释的字节。
pub fn read_attribute_data(
  img : @block.Image,
  vol : Volume,
  record : Bytes,
  attr : Attribute,
  path : String,
) -> Bytes raise NtfsError {
  if attr.is_encrypted() {
    raise Encrypted(path~)
  }
  if !attr.non_resident {
    return attr.value
  }
  if attr.data_size <= 0L {
    return Default::default()
  }
  let runs = runlist_of(attr, record)
  if attr.is_compressed() {
    read_compressed(img, vol, attr, runs)
  } else {
    read_from_runs(
      img,
      vol.base_offset,
      vol.cluster_size,
      runs,
      0L,
      attr.data_size,
    )
  }
}

///|
/// 一个文件/目录的概要信息。
///
/// 逻辑大小与占用大小分开给出：压缩文件的逻辑大小可能远大于实际占用，
/// 只显示其中一个都会误导用户。
pub(all) struct FileInfo {
  number : Int64
  logical_size : Int64
  allocated_size : Int64
  compressed : Bool
  encrypted : Bool
  sparse : Bool
  is_directory : Bool
}

///|
/// 读取某条记录的概要信息。
pub fn stat_record(
  img : @block.Image,
  vol : Volume,
  mft : Mft,
  number : Int64,
) -> FileInfo raise NtfsError {
  let raw = mft.read_record(img, number)
  let label = "MFT record " + number.to_string()
  let fixed = apply_fixup(raw, vol.bytes_per_sector, label)
  let header = parse_record(fixed)
  let attrs = parse_attributes(fixed, header.used_size)
  reject_attribute_list(attrs, label)
  match find_named_attribute(attrs, ATTR_DATA, "") {
    Some(attr) => {
      // 物理占用按 runlist 里非稀疏簇的合计算，而不是读属性头 0x28。
      //
      // 压缩属性的 0x28 存的是「按压缩单元向上取整后的虚拟分配」：一个
      // 204847 字节、压缩率 7:1 的文件，0x28 写 262144（64 簇），而它
      // 实际只占 7 簇 = 28672 字节——`compact` 报的正是后者。照 0x28 显示
      // 会让压缩文件看起来比原文还占地方，与事实相反。
      let allocated = if attr.non_resident {
        allocated_clusters(runlist_of(attr, fixed)) *
        vol.cluster_size.to_int64()
      } else {
        attr.allocated_size
      }
      {
        number,
        logical_size: attr.data_size,
        allocated_size: allocated,
        compressed: attr.is_compressed(),
        encrypted: attr.is_encrypted(),
        sparse: attr.is_sparse(),
        is_directory: header.is_directory(),
      }
    }
    None =>
      {
        number,
        logical_size: 0L,
        allocated_size: 0L,
        compressed: false,
        encrypted: false,
        sparse: false,
        is_directory: header.is_directory(),
      }
  }
}

///|
/// 按 MFT 记录号读取文件内容。
///
/// 目录返回空字节：目录没有默认 `$DATA`，这不是错误。
pub fn read_file(
  img : @block.Image,
  vol : Volume,
  mft : Mft,
  number : Int64,
) -> Bytes raise NtfsError {
  let raw = mft.read_record(img, number)
  let label = "MFT record " + number.to_string()
  let fixed = apply_fixup(raw, vol.bytes_per_sector, label)
  let header = parse_record(fixed)
  let attrs = parse_attributes(fixed, header.used_size)
  reject_attribute_list(attrs, label)
  match find_named_attribute(attrs, ATTR_DATA, "") {
    Some(attr) => read_attribute_data(img, vol, fixed, attr, label)
    None => Default::default()
  }
}

///|
/// 拒绝带 `$ATTRIBUTE_LIST` 的记录。
///
/// 属性多到一条记录装不下时，NTFS 会把部分属性放到扩展记录里，用
/// `$ATTRIBUTE_LIST` 串起来。一期没有实现合并，此时**必须报错**：
/// 静默忽略会让大文件丢属性、大目录丢条目，而调用方完全看不出来。
/// 报一个明确的 `Unsupported`，比给出一份"看起来完整"的错误结果好。
pub fn reject_attribute_list(
  attrs : Array[Attribute],
  label : String,
) -> Unit raise NtfsError {
  match find_attribute(attrs, ATTR_ATTRIBUTE_LIST) {
    Some(_) =>
      raise Unsupported(
        feature=label +
          " uses $ATTRIBUTE_LIST (attributes span multiple records)",
      )
    None => ()
  }
}
