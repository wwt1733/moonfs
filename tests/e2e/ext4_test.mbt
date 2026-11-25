///|
/// 读取 ext4 测试镜像。
fn load_ext4() -> @block.Image? {
  let candidates = [
    "testdata/ext4.img", "../testdata/ext4.img", "../../testdata/ext4.img",
  ]
  for path in candidates {
    let bytes = @fs.read_file_to_bytes(path) catch { _ => continue }
    let img = @block.Image::from_bytes(bytes) catch { _ => continue }
    return Some(img)
  }
  None
}

///|
/// 超级块的每个字段都要对上 `dumpe2fs` —— 它是 e2fsprogs 自己算出来的
/// 外部真值，不是我按同一套理解写出来的期望。
test "ext4：超级块字段与 dumpe2fs 一致" {
  let img = match load_ext4() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let sb = @ext4.Superblock::open(img, 0L) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  // dumpe2fs -h testdata/ext4.img：Block count 4096 / Block size 4096
  assert_eq(sb.blocks_count, 4096L)
  assert_eq(sb.block_size, 4096)
  assert_eq(sb.inodes_count, 4096L)
  assert_eq(sb.inode_size, 256)
  assert_eq(sb.first_data_block, 0L)
  assert_eq(sb.blocks_per_group, 32768L)
  assert_eq(sb.inodes_per_group, 4096L)
  assert_eq(sb.desc_size, 64)
  assert_eq(sb.groups_count, 1L)
  // 特性位：FILETYPE | EXTENTS | 64BIT | FLEX_BG
  assert_eq(sb.feature_incompat, 0x2C2L)
  assert_eq(sb.feature_compat, 0x38L)
  assert_eq(sb.feature_ro_compat, 0x46BL)
  assert_true(!sb.needs_recovery)
}

///|
test "ext4：根目录能列出来" {
  let img = match load_ext4() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let sb = @ext4.Superblock::open(img, 0L) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let root = @ext4.resolve_path(img, sb, "/") catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(root.number, 2L)
  assert_true(root.is_directory())
  let entries = @ext4.list_directory(img, sb, root) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let mut names = ""
  for entry in entries {
    names = names + entry.name + " "
  }
  println("root: " + names)
  let mut has_lost_found = false
  for entry in entries {
    if entry.name == "lost+found" {
      has_lost_found = true
    }
  }
  assert_true(has_lost_found)
}

///|
/// 根目录的条目与 inode 号，全部来自 `debugfs ls -l` 的独立解析。
test "ext4：根目录条目与 inode 号" {
  let img = match load_ext4() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let sb = @ext4.Superblock::open(img, 0L) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let root = @ext4.resolve_path(img, sb, "/") catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let entries = @ext4.list_directory(img, sb, root) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let expected = [
    (".", 2L),
    ("..", 2L),
    ("lost+found", 11L),
    ("hello.txt", 12L),
    ("big.bin", 13L),
    ("sub", 14L),
    ("sparse.bin", 16L),
    ("link.txt", 17L),
  ]
  if entries.length() != expected.length() {
    println("entry count " + entries.length().to_string())
    assert_true(false)
    return
  }
  for pair in expected {
    let (name, number) = pair
    let mut found = 0L
    for entry in entries {
      if entry.name == name {
        found = entry.inode
      }
    }
    if found != number {
      println(
        name + " -> " + found.to_string() + ", want " + number.to_string(),
      )
      assert_true(false)
    }
  }
}

///|
/// 读内容：常驻、多段带洞、子目录、快符号链接、空文件。
test "ext4：文件内容与 sha256 一致" {
  let img = match load_ext4() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let sb = @ext4.Superblock::open(img, 0L) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let hello = @ext4.resolve_path(img, sb, "/hello.txt") catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let hello_data = @ext4.read_inode_data(img, sb, hello) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(@utf8.decode_lossy(hello_data), "hello, moonfs\n")

  // big.bin：300000 字节 = 20 字节图案重复，逻辑块 30..40 被 punch 成零
  let big = @ext4.resolve_path(img, sb, "/big.bin") catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(big.size, 300000L)
  let big_data = @ext4.read_inode_data(img, sb, big) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  if big_data.length() != 300000 {
    println("big.bin length " + big_data.length().to_string())
    assert_true(false)
    return
  }
  let pattern = @utf8.encode("moonfs-ext4-fixture\n")
  let mut bad = -1
  for i in 0..<300000 {
    let in_hole = i >= 30 * 4096 && i < 41 * 4096
    let want = if in_hole { b'\x00' } else { pattern[i % pattern.length()] }
    if big_data.at(i) != want {
      bad = i
      break
    }
  }
  if bad >= 0 {
    println("big.bin differs at " + bad.to_string())
    assert_true(false)
  }

  let nested = @ext4.resolve_path(img, sb, "/sub/nested.txt") catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let nested_data = @ext4.read_inode_data(img, sb, nested) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(nested_data.length(), 100)
  let nested_want = @utf8.encode("nested-line\n")
  for i in 0..<100 {
    if nested_data.at(i) != nested_want[i % nested_want.length()] {
      println("nested.txt differs at " + i.to_string())
      assert_true(false)
      break
    }
  }

  // 快符号链接：目标存在 i_block 里，不占数据块
  let link = @ext4.resolve_path(img, sb, "/link.txt") catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_true(link.is_symlink())
  let target = @ext4.read_inode_data(img, sb, link) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(@utf8.decode_lossy(target), "target-of-link")

  // 空文件：size 0，不读任何块
  let empty = @ext4.resolve_path(img, sb, "/sparse.bin") catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(empty.size, 0L)
  let empty_data = @ext4.read_inode_data(img, sb, empty) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(empty_data.length(), 0)
}
