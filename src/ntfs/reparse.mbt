///|
/// 重解析点（reparse point）。
///
/// NTFS 把符号链接、目录联接（junction）、OneDrive 占位文件都塞进
/// `$REPARSE_POINT` 属性里，靠开头的 tag 区分。镜像解析器能读到的是
/// **链接本身**，不是它指向的东西——目标可能在镜像之外，也可能是另一台
/// 机器上的路径。所以这里只解析目标字符串，不跟随。
pub(all) struct ReparsePoint {
  /// 32 位 tag 原值，未知类型时调用方仍能打印出来。
  tag : Int64
  /// `symlink` / `mount-point` / `other`。
  kind : String
  /// 内核看到的目标，通常是 `\??\C:\...` 这种 NT 路径。
  substitute : String
  /// 给用户看的目标，通常是普通路径。
  print_name : String
}

///|
/// 符号链接的 reparse tag。
const REPARSE_TAG_SYMLINK : Int64 = 0xA000000C

///|
/// 目录联接（junction）的 reparse tag。
const REPARSE_TAG_MOUNT_POINT : Int64 = 0xA0000003

///|
/// 解析 `$REPARSE_POINT` 的值。
///
/// 布局：8 字节通用头（tag、data length、reserved），随后是与 tag 相关的
/// 数据。符号链接在路径缓冲区前多 4 字节 flags，联接没有——差这 4 字节，
/// 偏移整体错位，读出来就是半个汉字。
///
/// 路径偏移都是**相对路径缓冲区起点**的，不是相对属性起点。
pub fn parse_reparse_point(value : Bytes) -> ReparsePoint raise NtfsError {
  if value.length() < 8 {
    raise Corrupt(reason="reparse point is shorter than its 8-byte header")
  }
  let tag = rd_u32(value, 0)
  let kind = if tag == REPARSE_TAG_SYMLINK {
    "symlink"
  } else if tag == REPARSE_TAG_MOUNT_POINT {
    "mount-point"
  } else {
    "other"
  }
  if kind == "other" {
    return { tag, kind, substitute: "", print_name: "", }
  }
  // symlink: 0x08..0x14 是四个长度字段 + flags，路径从 0x14 开始
  // mount point: 0x08..0x10 是四个长度字段，路径从 0x10 开始
  let base = if tag == REPARSE_TAG_SYMLINK { 0x14 } else { 0x10 }
  if value.length() < base {
    raise Corrupt(reason="reparse point is shorter than its path header")
  }
  let sub_off = rd_u16(value, 0x08).to_int()
  let sub_len = rd_u16(value, 0x0A).to_int()
  let print_off = rd_u16(value, 0x0C).to_int()
  let print_len = rd_u16(value, 0x0E).to_int()
  let slice = fn(off : Int32, len : Int32) -> String {
    if len == 0 || base + off + len > value.length() {
      ""
    } else {
      utf16le_to_string(value, base + off, len)
    }
  }
  {
    tag,
    kind,
    substitute: slice(sub_off, sub_len),
    print_name: slice(print_off, print_len),
  }
}

///|
/// 读一条记录上的重解析点。不是重解析点就返回 `None`——目录与普通文件
/// 都走这条路，所以不能把"没有"当成错误。
pub fn reparse_of(
  img : @block.Image,
  vol : Volume,
  mft : Mft,
  number : Int64,
) -> ReparsePoint? raise NtfsError {
  let attrs = load_attributes(img, vol, mft, number)
  match find_attribute(attrs, ATTR_REPARSE_POINT) {
    Some(attr) => {
      let value = read_attribute_data(
        img,
        vol,
        attr,
        "MFT record " + number.to_string(),
      )
      Some(parse_reparse_point(value))
    }
    None => None
  }
}
