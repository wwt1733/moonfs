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

///|
/// MFT 的布局：记录大小与 `$MFT` 自己的 runlist。
///
/// 不能假设 MFT 在磁盘上连续。格式化时会预留一段连续空间，但卷用久了
/// 会被打散。因此先读记录 0 拿到 `$MFT` 的 `$DATA`，之后所有记录都按
/// runlist 定位。
pub(all) struct Mft {
  cluster_size : Int32
  record_size : Int32
  /// 卷在镜像内的字节起点，读取记录时必须带上。
  base_offset : Int64
  runs : Array[Run]
}

///|
/// 打开 MFT。
///
/// 记录 0 必须能从 boot 里的 `mft_lcn` 直接定位，所以它占用的簇一定
/// 连续——这正是用单条 `$DATA` 反推整个布局的前提。
pub fn Mft::open(img : @block.Image, vol : Volume) -> Mft raise NtfsError {
  let start = vol.mft_offset()
  let raw = img.read(start, vol.mft_record_size) catch {
    err => raise Io(reason="cannot read MFT record 0: " + @block.reason_of(err))
  }
  let fixed = apply_fixup(raw, vol.bytes_per_sector, "MFT record 0")
  let header = parse_record(fixed)
  let attrs = parse_attributes(fixed, header.used_size)
  let data = match find_named_attribute(attrs, ATTR_DATA, "") {
    Some(attr) => attr
    None => raise Corrupt(reason="MFT record 0 has no default $DATA attribute")
  }
  if !data.non_resident {
    raise Corrupt(reason="MFT is resident, which a real volume never allows")
  }
  let runs = runlist_of(data, fixed)
  {
    cluster_size: vol.cluster_size,
    record_size: vol.mft_record_size,
    base_offset: vol.base_offset,
    runs,
  }
}

///|
/// 按 runlist 读取任意字节区间。
///
/// 稀疏段补零而不是报错——稀疏文件的空洞必须表现为零字节，这是它和
/// "读失败"的区别。runlist 覆盖不到的位置才报错，因为那说明元数据
/// 本身不完整。
pub fn read_from_runs(
  img : @block.Image,
  base_offset : Int64,
  cluster_size : Int32,
  runs : Array[Run],
  byte_offset : Int64,
  len : Int64,
) -> Bytes raise NtfsError {
  let out : Array[Byte] = []
  let cluster = cluster_size.to_int64()
  let mut pos = byte_offset
  let mut remaining = len
  while remaining > 0L {
    let vcn = pos / cluster
    let in_cluster = pos % cluster
    let mut chunk = cluster - in_cluster
    if chunk > remaining {
      chunk = remaining
    }
    match lookup_cluster(runs, vcn) {
      Some(Some(lcn)) => {
        let at = base_offset + lcn * cluster + in_cluster
        let bytes = img.read(at, chunk.to_int()) catch {
          err =>
            raise Io(
              reason="cannot read cluster data: " + @block.reason_of(err),
            )
        }
        for i in 0..<bytes.length() {
          out.push(bytes.at(i))
        }
      }
      Some(None) =>
        for _ in 0..<chunk.to_int() {
          out.push(Byte::default())
        }
      None =>
        raise Corrupt(
          reason="runlist does not cover byte offset " + pos.to_string(),
        )
    }
    pos = pos + chunk
    remaining = remaining - chunk
  }
  Bytes::from_array(out)
}

///|
/// 读取指定序号的 MFT 记录（未修复 USA）。
pub fn Mft::read_record(
  self : Mft,
  img : @block.Image,
  number : Int64,
) -> Bytes raise NtfsError {
  if number < 0L {
    raise Corrupt(reason="negative MFT record number")
  }
  let offset = number * self.record_size.to_int64()
  read_from_runs(
    img,
    self.base_offset,
    self.cluster_size,
    self.runs,
    offset,
    self.record_size.to_int64(),
  )
}
