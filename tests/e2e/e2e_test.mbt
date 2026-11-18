///|
/// 读取测试镜像。
///
/// `moon test` 的工作目录依工具链版本可能是模块根或包目录，两个位置都
/// 试一次，避免测试因为路径而不是逻辑挂掉。
fn load_image() -> @block.Image? {
  let candidates = [
    "testdata/synth-ntfs.img", "../testdata/synth-ntfs.img", "../../testdata/synth-ntfs.img",
  ]
  for path in candidates {
    let bytes = @fs.read_file_to_bytes(path) catch { _ => continue }
    let img = @block.Image::from_bytes(bytes) catch { _ => continue }
    return Some(img)
  }
  None
}

///|
fn open_volume(img : @block.Image) -> @ntfs.Volume? {
  let vol = @ntfs.Volume::open(img, 0L) catch { _ => return None }
  Some(vol)
}

///|
/// 找一个目录条目。
fn entry_named(
  entries : Array[@ntfs.DirEntry],
  name : String,
) -> @ntfs.DirEntry? {
  for entry in entries {
    if entry.name == name {
      return Some(entry)
    }
  }
  None
}

///|
test "合成镜像：根目录六个条目，大小与生成器一致" {
  let img = match load_image() {
    Some(v) => v
    None => {
      // 读不到测试镜像就是失败：静默 return 会让测试"通过"却没验证任何东西
      assert_true(false)
      return
    }
  }
  let vol = match open_volume(img) {
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
  let entries = @ntfs.list_directory(img, vol, mft, 5L) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(entries.length(), 6)
  let expected = [
    ("big.bin", 1000L),
    ("compressed.txt", 1024L),
    ("deep.bin", 2000L),
    ("hello.txt", 14L),
    ("sparse.bin", 512L),
    ("split.bin", 2000L),
  ]
  for pair in expected {
    let (name, size) = pair
    let entry = match entry_named(entries, name) {
      Some(v) => v
      None => {
        assert_true(false)
        return
      }
    }
    assert_eq(entry.logical_size, size)
    assert_true(!entry.is_directory())
  }
}

///|
test "合成镜像：常驻数据逐字节正确" {
  let img = match load_image() {
    Some(v) => v
    None => {
      // 读不到测试镜像就是失败：静默 return 会让测试"通过"却没验证任何东西
      assert_true(false)
      return
    }
  }
  let vol = match open_volume(img) {
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
  let entries = @ntfs.list_directory(img, vol, mft, 5L) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let entry = match entry_named(entries, "hello.txt") {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let data = @ntfs.read_file(img, vol, mft, entry.record_number) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(data.length(), 14)
  assert_eq(@utf8.decode_lossy(data), "hello, moonfs\n")
}

///|
test "合成镜像：非常驻数据跨簇拼接" {
  let img = match load_image() {
    Some(v) => v
    None => {
      // 读不到测试镜像就是失败：静默 return 会让测试"通过"却没验证任何东西
      assert_true(false)
      return
    }
  }
  let vol = match open_volume(img) {
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
  let entries = @ntfs.list_directory(img, vol, mft, 5L) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let entry = match entry_named(entries, "big.bin") {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let data = @ntfs.read_file(img, vol, mft, entry.record_number) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  // 生成器的填充公式是 (i * 37 + 11) & 0xFF
  assert_eq(data.length(), 1000)
  let mut ok = true
  for i in 0..<1000 {
    let expect = (i * 37 + 11) % 256
    if data.at(i).to_int() != expect {
      ok = false
    }
  }
  assert_true(ok)
}

///|
test "合成镜像：压缩文件解压后与原始内容一致" {
  let img = match load_image() {
    Some(v) => v
    None => {
      // 读不到测试镜像就是失败：静默 return 会让测试"通过"却没验证任何东西
      assert_true(false)
      return
    }
  }
  let vol = match open_volume(img) {
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
  let entries = @ntfs.list_directory(img, vol, mft, 5L) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let entry = match entry_named(entries, "compressed.txt") {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let data = @ntfs.read_file(img, vol, mft, entry.record_number) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(data.length(), 1024)
  let mut ok = true
  for i in 0..<1024 {
    if data.at(i).to_int() != 0x41 {
      ok = false
    }
  }
  assert_true(ok)
}

///|
test "合成镜像：稀疏区间读作零" {
  let img = match load_image() {
    Some(v) => v
    None => {
      // 读不到测试镜像就是失败：静默 return 会让测试"通过"却没验证任何东西
      assert_true(false)
      return
    }
  }
  let vol = match open_volume(img) {
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
  let entries = @ntfs.list_directory(img, vol, mft, 5L) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let entry = match entry_named(entries, "sparse.bin") {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let data = @ntfs.read_file(img, vol, mft, entry.record_number) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(data.length(), 512)
  let mut ok = true
  for i in 0..<512 {
    if data.at(i).to_int() != 0 {
      ok = false
    }
  }
  assert_true(ok)
}

///|
test "合成镜像：stat 报告压缩与稀疏标志" {
  let img = match load_image() {
    Some(v) => v
    None => {
      // 读不到测试镜像就是失败：静默 return 会让测试"通过"却没验证任何东西
      assert_true(false)
      return
    }
  }
  let vol = match open_volume(img) {
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
  let entries = @ntfs.list_directory(img, vol, mft, 5L) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let compressed = match entry_named(entries, "compressed.txt") {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let info = @ntfs.stat_record(img, vol, mft, compressed.record_number) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_true(info.compressed)
  assert_eq(info.logical_size, 1024L)
  assert_eq(info.allocated_size, 512L)

  let sparse = match entry_named(entries, "sparse.bin") {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let sparse_info = @ntfs.stat_record(img, vol, mft, sparse.record_number) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_true(sparse_info.sparse)
  assert_eq(sparse_info.allocated_size, 0L)
}

///|
/// 一个文件的 `$DATA` 被拆进两条记录时，必须合并后再读。
///
/// 只读主记录不会报错——它照样给出 1024 字节，只是后半段悄悄丢了。
/// 这种"看起来成功"的半份数据比报错危险得多，所以合成镜像里专门放了
/// 一个这样的文件：两段落在不相邻的簇上，顺序接错会立刻读出错误内容。
test "合成镜像：跨记录的 $DATA 段被合并" {
  let img = match load_image() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let vol = match open_volume(img) {
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
  let entries = @ntfs.list_directory(img, vol, mft, 5L) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let entry = match entry_named(entries, "split.bin") {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let info = @ntfs.stat_record(img, vol, mft, entry.record_number) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(info.logical_size, 2000L)
  // 两段各占 2 簇 = 2048 字节，与逻辑大小 2000 不同：尾部有 48 字节余量
  assert_eq(info.allocated_size, 2048L)

  let data = @ntfs.read_file(img, vol, mft, entry.record_number) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  if data.length() != 2000 {
    println("split.bin length " + data.length().to_string())
    assert_true(false)
    return
  }
  for i in 0..<2000 {
    if data.at(i).to_int() != ((i * 7 + 3) & 0xFF) {
      println("split.bin differs at " + i.to_string())
      assert_true(false)
      return
    }
  }
}

///|
/// `$ATTRIBUTE_LIST` 自己也非常驻时，仍要合并出完整文件。
///
/// 列表装不进一条记录时会被搬到簇上，runlist 留在主记录里。读它不需要
/// 先打开 MFT——所以这里没有循环依赖。漏掉这一层的话扩展记录永远找不到，
/// deep.bin 会安静地少读一半，而不是报错。
test "合成镜像：非常驻的 $ATTRIBUTE_LIST 也能合并出完整文件" {
  let img = match load_image() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let vol = match open_volume(img) {
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
  let entries = @ntfs.list_directory(img, vol, mft, 5L) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let entry = match entry_named(entries, "deep.bin") {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }

  // 先钉住 fixture 的形状：列表本身必须是非常驻的，否则这条测试什么也没验证
  let attrs = @ntfs.load_attributes(img, vol, mft, entry.record_number) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let list = match @ntfs.find_attribute(attrs, 0x20L) {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  assert_true(list.non_resident)
  let data_attr = match @ntfs.find_named_attribute(attrs, 0x80L, "") {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  // 两段各 2 簇，合并后 runlist 必须是 4 个簇
  assert_eq(@ntfs.allocated_clusters(@ntfs.runlist_of(data_attr)), 4L)

  let data = @ntfs.read_file(img, vol, mft, entry.record_number) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  if data.length() != 2000 {
    println("deep.bin length " + data.length().to_string())
    assert_true(false)
    return
  }
  for i in 0..<2000 {
    if data.at(i).to_int() != ((i * 13 + 5) & 0xFF) {
      println("deep.bin differs at " + i.to_string())
      assert_true(false)
      return
    }
  }
}
