///|
/// 目录里的一个条目。
///
/// 时间与大小都原样保留 FILETIME / 字节数，格式化留给上层——解析层
/// 一旦做了本地化，三个后端的输出就会不一致。
pub(all) struct DirEntry {
  record_number : Int64
  sequence : Int64
  name : String
  /// $FILE_NAME 里的命名空间：0 POSIX、1 Win32、2 DOS、3 Win32&DOS。
  name_ns : Int32
  created : Int64
  modified : Int64
  accessed : Int64
  logical_size : Int64
  allocated_size : Int64
  flags : Int64
}

///|
/// `$FILE_NAME` 的 flags 里表示"这是一个目录"的位。
const FILE_ATTRIBUTE_DIRECTORY : Int64 = 0x10000000

///|
/// 条目是否为目录。
pub fn DirEntry::is_directory(self : DirEntry) -> Bool {
  (self.flags & FILE_ATTRIBUTE_DIRECTORY) != 0L
}

///|
/// 索引项是当前节点的最后一项。
const INDEX_ENTRY_LAST : Int64 = 0x0002

///|
/// 解析一个索引节点（`$INDEX_ROOT` 的值内嵌，或 `INDX` 块内）。
///
/// `header_start` 指向 `INDEX_HEADER` 的起点：`$INDEX_ROOT` 里是值的
/// 0x10 处（前面有索引属性头和排序规则），`INDX` 块里是 0x18 处（前面
/// 有签名、USA 与 VCN）。
///
/// 只收集带 key 的条目，不跟随子节点：NTFS 的 `$I30` 是 B+ 树，内部节点
/// 的 key 本身就是真实条目，而所有叶子都位于被 `$INDEX_ALLOCATION`
/// 覆盖的块中。把根节点和所有块各遍历一遍，每个文件恰好出现一次。
fn collect_index_entries(
  data : Bytes,
  header_start : Int32,
  out : Array[DirEntry],
) -> Unit raise NtfsError {
  if header_start + 0x10 > data.length() {
    raise Corrupt(reason="index header is outside the buffer")
  }
  let entries_offset = rd_u32(data, header_start)
  let index_length = rd_u32(data, header_start + 4)
  let start = header_start + entries_offset.to_int()
  let end = header_start + index_length.to_int()
  if entries_offset < 0L ||
    index_length < 0L ||
    end > data.length() ||
    start > end {
    raise Corrupt(
      reason="index node declares a range outside its buffer (" +
        start.to_string() +
        ".." +
        end.to_string() +
        ")",
    )
  }
  let mut pos = start
  while pos + 0x10 <= end {
    let entry_length = rd_u16(data, pos + 0x08).to_int()
    let key_length = rd_u16(data, pos + 0x0A).to_int()
    let flags = rd_u16(data, pos + 0x0C)
    // 长度为零会让循环原地打转，必须挡住
    if entry_length < 0x10 {
      raise Corrupt(
        reason="index entry declares length " + entry_length.to_string(),
      )
    }
    if key_length >= 0x42 && pos + 0x10 + key_length <= end {
      // 条目自身指向的 MFT 记录，低 48 位是记录号，高 16 位是序列号。
      // 注意不能用 $FILE_NAME 里的 parent 引用——那是父目录。
      let entry_ref = rd_i64(data, pos)
      let key = @binio.slice(data, pos + 0x10, key_length) catch {
        _ => raise Corrupt(reason="cannot read index entry key")
      }
      let parsed = Some(parse_file_name(key)) catch { _ => None }
      if parsed is Some(info) {
        // DOS 8.3 短名不单独列出：同一文件的长名就在同一个索引里，
        // 把短名也输出会让目录看起来有重复文件。
        if info.name_ns != 2 {
          out.push({
            record_number: entry_ref & 0x0000FFFFFFFFFFFFL,
            sequence: (entry_ref >> 48) & 0xFFFFL,
            name: info.name,
            name_ns: info.name_ns,
            created: info.created,
            modified: info.modified,
            accessed: info.accessed,
            logical_size: info.logical_size,
            allocated_size: info.allocated_size,
            flags: info.flags,
          })
        }
      }
    }
    if (flags & INDEX_ENTRY_LAST) != 0L {
      break
    }
    pos = pos + entry_length
  }
}

///|
/// 列出一个目录的内容。
///
/// `number` 是目录自身的 MFT 记录号（根目录是 5）。
pub fn list_directory(
  img : @block.Image,
  vol : Volume,
  mft : Mft,
  number : Int64,
) -> Array[DirEntry] raise NtfsError {
  let raw = mft.read_record(img, number)
  let label = "MFT record " + number.to_string()
  let fixed = apply_fixup(raw, vol.bytes_per_sector, label)
  let header = parse_record(fixed)
  if !header.is_directory() {
    raise Corrupt(reason=label + " is not a directory")
  }
  // 大目录的 $INDEX_ALLOCATION 会被拆到扩展记录里，走合并版
  let attrs = load_attributes(img, vol, mft, number)
  let out : Array[DirEntry] = []
  match find_named_attribute(attrs, ATTR_INDEX_ROOT, "$I30") {
    Some(root) => collect_index_entries(root.value, 0x10, out)
    None => raise Corrupt(reason=label + " has no $I30 index root attribute")
  }
  // 目录大到根节点装不下时，条目会分散到 $INDEX_ALLOCATION 的块里
  match find_named_attribute(attrs, ATTR_INDEX_ALLOCATION, "$I30") {
    Some(alloc) => {
      let runs = runlist_of(alloc)
      let cluster = vol.cluster_size.to_int64()
      let block = vol.index_record_size.to_int64()
      let cover = total_clusters(runs) * cluster
      let mut index = 0L
      while index * block < cover {
        let bytes = read_from_runs(
          img,
          vol.base_offset,
          vol.cluster_size,
          runs,
          index * block,
          block,
        )
        // 未初始化的块是全零，签名不对，直接跳过
        if @binio.starts_with(bytes, 0, b"INDX") {
          let repaired = apply_fixup(
            bytes,
            vol.bytes_per_sector,
            "INDX block " + index.to_string(),
          )
          collect_index_entries(repaired, 0x18, out)
        }
        index = index + 1L
      }
    }
    None => ()
  }
  out
}

///|
/// 打开卷并取得根目录条目。
pub fn list_root(
  img : @block.Image,
  vol : Volume,
) -> Array[DirEntry] raise NtfsError {
  let mft = Mft::open(img, vol)
  list_directory(img, vol, mft, 5L)
}
