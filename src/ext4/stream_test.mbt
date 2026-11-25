///|
/// 一块 4096 字节的缓冲：第 3 个块填满 0x5A，其余为零。
///
/// 未初始化段指向的就是这个块。磁盘上是真数据，语义上却是"没写过"——
/// 只有这种构造能分辨"跳过"和"照读"：块里若是零，两种实现都会通过。
fn ex_image_with_stale_block() -> @block.Image? {
  let block_size = 4096
  let arr = FixedArray::make(4 * block_size, Byte::default())
  for i in 0..<block_size {
    arr[3 * block_size + i] = b'\x5a'
  }
  let img = @block.Image::from_bytes(Bytes::from_array(arr)) catch {
    _ => return None
  }
  Some(img)
}

///|
fn ex_sb() -> @ext4.Superblock {
  {
    inodes_count: 2048L,
    blocks_count: 4L,
    first_data_block: 0L,
    block_size: 4096,
    blocks_per_group: 32768L,
    inodes_per_group: 2048L,
    inode_size: 256,
    desc_size: 64,
    feature_compat: 0x38L,
    feature_incompat: 0x2C2L,
    feature_ro_compat: 0x46BL,
    uuid: Bytes::new(16),
    volume_name: "",
    base_offset: 0L,
    groups_count: 1L,
    needs_recovery: false,
  }
}

///|
/// 60 字节的 extent 根节点：一段、从逻辑块 0 起、物理块 3。
/// `ee_len` 由调用方给，高位置 1 表示未初始化。
fn ex_extent_root(ee_len : Int64) -> Bytes {
  let arr = FixedArray::make(60, Byte::default())
  fn put16(a : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
    a[off] = (value & 0xFFL).to_int().to_byte()
    a[off + 1] = ((value >> 8) & 0xFFL).to_int().to_byte()
  }

  fn put32(a : FixedArray[Byte], off : Int32, value : Int64) -> Unit {
    a[off] = (value & 0xFFL).to_int().to_byte()
    a[off + 1] = ((value >> 8) & 0xFFL).to_int().to_byte()
    a[off + 2] = ((value >> 16) & 0xFFL).to_int().to_byte()
    a[off + 3] = ((value >> 24) & 0xFFL).to_int().to_byte()
  }

  put16(arr, 0, 0xF30A) // 魔数
  put16(arr, 2, 1) // 一项
  put16(arr, 4, 4) // 容量
  put16(arr, 6, 0) // 深度 0，叶子
  put32(arr, 12, 0) // 起始逻辑块
  put16(arr, 16, ee_len)
  put16(arr, 18, 0) // 物理块高位
  put32(arr, 20, 3) // 物理块低位
  Bytes::from_array(arr)
}

///|
fn ex_inode(size : Int64, ee_len : Int64) -> @ext4.Inode {
  {
    number: 42L,
    mode: 0x8000L,
    size,
    modified: 0L,
    modified_ns: 0L,
    created: 0L,
    accessed: 0L,
    changed: 0L,
    links_count: 1L,
    flags: 0x00080000L,
    block: ex_extent_root(ee_len),
    sectors: 8L,
  }
}

///|
/// 未初始化段必须读作零，哪怕磁盘上那个块里躺着别的字节。
///
/// 这不是洁癖：预分配（fallocate）的文件就是这样标记的，照着读会把
/// 上一个文件的残留当成内容返回。真镜像里那个块的字节恰好是零，
/// 所以这一条必须在块里塞满 0x5A 才测得出东西来。
test "ext4：未初始化段不返回磁盘上的旧字节" {
  let img = match ex_image_with_stale_block() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let sb = ex_sb()
  let inode = ex_inode(4096L, 0x8001L)
  let data = @ext4.read_inode_data(img, sb, inode) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(data.length(), 4096)
  let mut bad = -1
  for i in 0..<4096 {
    if data.at(i) != b'\x00' {
      bad = i
      break
    }
  }
  if bad >= 0 {
    println(
      "uninitialized run returned byte 0x" + data.at(bad).to_int().to_string(),
    )
    assert_true(false)
  }
}

///|
/// `ee_len` 的边界：0x8000 是**已初始化**的 32768 块，不是未初始化。
///
/// 用 `>=` 判断会把这个合法值整段读成零，文件内容凭空消失；
/// 用 `>` 才对。这条只有卡在边界上才测得出。
test "ext4：ee_len 0x8000 是已初始化，不是标志位" {
  let img = match ex_image_with_stale_block() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let sb = ex_sb()
  let inode = ex_inode(32768L * 4096L, 0x8000L)
  let runs = @ext4.extent_runs(img, sb, inode) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(runs.length(), 1)
  assert_eq(runs[0].length, 32768L)
  assert_true(!runs[0].uninitialized)
  assert_eq(runs[0].physical, 3L)
}
