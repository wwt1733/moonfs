///|
/// 镜像访问错误。
pub suberror BlockError {
  /// 请求区间超出镜像长度。
  OutOfBounds(offset~ : Int64, need~ : Int64, size~ : Int64)
  /// 扇区大小不是 2 的幂，或不在支持范围内。
  InvalidSectorSize(size~ : Int32)
}

///|
/// 一块只读镜像。
///
/// `Image` 不做任何缓存：所有读取都直接落在传入的 `Bytes` 上，
/// 因此同一份镜像可以被多个解析器共享，也可以在 wasm 里由宿主一次性
/// 传入而不复制。
pub(all) struct Image {
  data : Bytes
  sector_size : Int32
}

///|
/// 从内存字节构造镜像。
///
/// `sector_size` 只接受 512 / 1024 / 2048 / 4096，与 NTFS BPB 和
/// ext4 块大小可能出现的取值对齐。取其他值时报错，而不是猜一个。
pub fn Image::from_bytes(
  data : Bytes,
  sector_size? : Int32 = 512,
) -> Image raise BlockError {
  let ok = match sector_size {
    512 | 1024 | 2048 | 4096 => true
    _ => false
  }
  if !ok {
    raise InvalidSectorSize(size=sector_size)
  }
  { data: data, sector_size: sector_size }
}

///|
pub fn Image::data(self : Image) -> Bytes {
  self.data
}

///|
pub fn Image::sector_size(self : Image) -> Int32 {
  self.sector_size
}

///|
/// 镜像总字节数。
pub fn Image::size(self : Image) -> Int64 {
  self.data.length().to_int64()
}

///|
/// 按当前扇区大小可完整读取的扇区数量。
pub fn Image::sector_count(self : Image) -> Int64 {
  self.size() / self.sector_size.to_int64()
}

///|
/// 读取任意区间。
///
/// 区间必须完整落在镜像内；不做"读到多少算多少"的宽容处理，
/// 因为静默截断会让上层把残缺数据结构解析成合法数据。
pub fn Image::read(self : Image, offset : Int64, len : Int32) -> Bytes raise BlockError {
  let size = self.size()
  let need = len.to_int64()
  if offset < 0L || need < 0L || offset + need > size {
    raise OutOfBounds(offset~, need~, size~)
  }
  let start = offset.to_int()
  @binio.slice(self.data, start, len) catch {
    _ => raise OutOfBounds(offset~, need~, size~)
  }
}

///|
/// 读取单个扇区。
pub fn Image::read_sector(self : Image, lba : Int64) -> Bytes raise BlockError {
  self.read(lba * self.sector_size.to_int64(), self.sector_size)
}

///|
/// 连续读取多个扇区。
pub fn Image::read_sectors(
  self : Image,
  lba : Int64,
  count : Int64,
) -> Bytes raise BlockError {
  if count < 0L {
    raise OutOfBounds(offset=lba * self.sector_size.to_int64(), need=count, size=self.size())
  }
  let total = count * self.sector_size.to_int64()
  if total > 0x7fffffffL {
    raise OutOfBounds(offset=lba * self.sector_size.to_int64(), need=total, size=self.size())
  }
  self.read(lba * self.sector_size.to_int64(), total.to_int())
}

///|
/// 把读取错误转成一行描述，供上层拼接自己的错误信息。
pub fn reason_of(err : BlockError) -> String {
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
