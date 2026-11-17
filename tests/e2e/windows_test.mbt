///|
/// 真实 Windows 卷的端到端验证。
///
/// `testdata/win-ntfs.img` 由 `tools/make_windows_image.ps1` 生成：Windows
/// 自己用 `diskpart` + `format fs=ntfs` 造出 NTFS 3.1 卷，再用 `compact /c`
/// 产生真正的 LZNT1 压缩。合成镜像能验证解析逻辑，但它是由本仓库自己的
/// 编码器写的，一旦编码器和解码器共享同一个误解，两边就会互相"印证"。
/// 这个文件的作用就是不给自己留这种余地。
///
/// 四个文件的**内容**在测试里重新算出来对比，不依赖任何预先记录的哈希：
/// 压缩路径必须还原出与写入时一模一样的字节。
const BIG_LINE : Bytes = b"moonfs compression fixture line - the quick brown fox jumps over the lazy dog\r\n"

///|
fn win_image() -> @block.Image? {
  let candidates = [
    "testdata/win-ntfs.img", "../testdata/win-ntfs.img", "../../testdata/win-ntfs.img",
  ]
  for path in candidates {
    let bytes = @fs.read_file_to_bytes(path) catch { _ => continue }
    let img = @block.Image::from_bytes(bytes) catch { _ => continue }
    return Some(img)
  }
  None
}

///|
/// 真实镜像带 MBR，卷从分区起点开始。走分区表而不是写死 LBA，
/// 顺便验证"卷基址"这条路——整盘镜像上分区不在 0 位置时最容易出错。
fn win_volume(img : @block.Image) -> @ntfs.Volume? {
  let parts = @partition.read(img) catch { _ => [] }
  for part in parts {
    let vol = @ntfs.Volume::open(img, part.start_lba) catch { _ => continue }
    return Some(vol)
  }
  None
}

///|
fn win_record_of(
  img : @block.Image,
  vol : @ntfs.Volume,
  mft : @ntfs.Mft,
  name : String,
) -> Int64? {
  let entries = @ntfs.list_directory(img, vol, mft, 5L) catch { _ => [] }
  for entry in entries {
    if entry.name == name {
      return Some(entry.record_number)
    }
  }
  None
}

///|
test "Windows 卷：卷头与根目录" {
  let img = match win_image() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let vol = match win_volume(img) {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  // Windows 的 24 MB 小卷默认 4 KiB 簇、1 KiB 记录、4 KiB 索引块
  assert_eq(vol.cluster_size, 4096)
  assert_eq(vol.mft_record_size, 1024)
  assert_eq(vol.index_record_size, 4096)
  let mft = @ntfs.Mft::open(img, vol) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let entries = @ntfs.list_directory(img, vol, mft, 5L) catch { _ => [] }
  // Windows 自己创建的元文件必须都在
  for
    name in [
      "$MFT", "$MFTMirr", "$LogFile", "$Volume", "$AttrDef", "$Bitmap", "$Boot",
      "$Secure", "$UpCase",
    ] {
    if win_record_of(img, vol, mft, name) is None {
      println("missing metadata file: " + name)
      assert_true(false)
      return
    }
  }
  if entries.length() < 15 {
    assert_true(false)
  }
}

///|
test "Windows 卷：压缩文件的占用大小按 runlist 算" {
  let img = match win_image() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let vol = match win_volume(img) {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let mft = @ntfs.Mft::open(img, vol) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  // 逻辑大小 204847、压缩率 7.1:1，实际占 7 簇 = 28672 字节。
  // 属性头 0x28 写的是 262144（按压缩单元取整的虚拟分配），照它显示
  // 会让压缩文件看起来比原文还占地方。
  let big = match win_record_of(img, vol, mft, "big.txt") {
    Some(n) => n
    None => {
      assert_true(false)
      return
    }
  }
  let big_info = @ntfs.stat_record(img, vol, mft, big) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(big_info.logical_size, 204847L)
  assert_eq(big_info.allocated_size, 28672L)
  assert_true(big_info.compressed)

  let mixed = match win_record_of(img, vol, mft, "mixed.bin") {
    Some(n) => n
    None => {
      assert_true(false)
      return
    }
  }
  let mixed_info = @ntfs.stat_record(img, vol, mft, mixed) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(mixed_info.logical_size, 196608L)
  assert_eq(mixed_info.allocated_size, 12288L)
  assert_true(mixed_info.compressed)
}

///|
test "Windows 卷：四个文件的内容与写入时逐字节一致" {
  let img = match win_image() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let vol = match win_volume(img) {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let mft = @ntfs.Mft::open(img, vol) catch {
    _ => {
      assert_true(false)
      return
    }
  }

  // plain.txt / small.txt 常驻在 MFT 记录里
  let plain_expect = b"moonfs windows fixture\r\nThis file is small enough to stay resident.\r\n"
  let small_expect = b"hi\r\n"
  for pair in [("plain.txt", plain_expect), ("small.txt", small_expect)] {
    let number = match win_record_of(img, vol, mft, pair.0) {
      Some(n) => n
      None => {
        assert_true(false)
        return
      }
    }
    let data = @ntfs.read_file(img, vol, mft, number) catch {
      _ => {
        assert_true(false)
        return
      }
    }
    if data.length() != pair.1.length() {
      println(pair.0 + " length mismatch")
      assert_true(false)
      return
    }
    for i in 0..<data.length() {
      if data.at(i) != pair.1.at(i) {
        println(pair.0 + " differs at " + i.to_string())
        assert_true(false)
        return
      }
    }
  }

  // big.txt：79 字节一行的 2593 次重复，走 LZNT1 解压
  let big = match win_record_of(img, vol, mft, "big.txt") {
    Some(n) => n
    None => {
      assert_true(false)
      return
    }
  }
  let big_data = @ntfs.read_file(img, vol, mft, big) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  if big_data.length() != 204847 {
    println("big.txt length " + big_data.length().to_string())
    assert_true(false)
    return
  }
  for i in 0..<204847 {
    if big_data.at(i) != BIG_LINE.at(i % 79) {
      println("big.txt differs at " + i.to_string())
      assert_true(false)
      return
    }
  }

  // mixed.bin：前 64 KiB 是确定字节，后 128 KiB 全零。压缩后后者很可能
  // 表现为稀疏段，读取必须补零而不是报错。
  let mixed = match win_record_of(img, vol, mft, "mixed.bin") {
    Some(n) => n
    None => {
      assert_true(false)
      return
    }
  }
  let mixed_data = @ntfs.read_file(img, vol, mft, mixed) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  if mixed_data.length() != 196608 {
    println("mixed.bin length " + mixed_data.length().to_string())
    assert_true(false)
    return
  }
  for i in 0..<196608 {
    let expect = if i < 65536 { (i * 37 + 11) & 0xFF } else { 0 }
    if mixed_data.at(i).to_int() != expect {
      println("mixed.bin differs at " + i.to_string())
      assert_true(false)
      return
    }
  }
}
