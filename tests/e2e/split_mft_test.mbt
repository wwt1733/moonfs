///|
/// `$MFT` 自己被拆成两段时的端到端验证。
///
/// 真实卷用久了 MFT 会碎片化，一条记录装不下整个 runlist，后面的段被搬到
/// 扩展记录，由 `$ATTRIBUTE_LIST` 串起来；列表本身往往也大到装不下记录，
/// 于是也被搬到簇上。这里就有个循环：读扩展记录要先有 MFT 的 runlist，
/// 而 runlist 由住在 MFT 里的属性描述。
///
/// 拆开它的是这一点：列表带着自己的 runlist，按普通数据读就能取到，不必
/// 先打开 MFT。`testdata/synth-mft-split.img` 专门制造了这个形状——根目录
/// 记录 5 和文件记录 6 都在**第二段**里，读不出合并结果就什么都读不到。
fn split_image() -> @block.Image? {
  let candidates = [
    "testdata/synth-mft-split.img", "../testdata/synth-mft-split.img", "../../testdata/synth-mft-split.img",
  ]
  for path in candidates {
    let bytes = @fs.read_file_to_bytes(path) catch { _ => continue }
    let img = @block.Image::from_bytes(bytes) catch { _ => continue }
    return Some(img)
  }
  None
}

///|
test "$MFT 拆段 + 非常驻列表：第二段里的记录仍可读" {
  let img = match split_image() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let vol = @ntfs.Volume::open(img, 0L) catch {
    _ => {
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
  // 两段必须真的合并了：只读到记录 0 的话这里只有 1 个 run
  if mft.runs.length() != 2 {
    println("MFT runs = " + mft.runs.length().to_string())
    assert_true(false)
    return
  }

  // 根目录记录 5 在第二段里，合并失败会在这里报 "runlist does not cover"
  let entries = @ntfs.list_directory(img, vol, mft, 5L) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  let entry = match entry_named(entries, "after.bin") {
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
  assert_eq(@utf8.decode_lossy(data), "read from the second MFT run\n")
}

///|
/// EFS 加密文件：只能报错，不能把密文当成内容返回。
///
/// 离线解析器拿不到用户证书与私钥，这是物理上不可行。但"读不了"必须
/// 明确说出来——返回 16 个字节的密文，调用方会以为读到了文件。
test "EFS 文件报错而不是返回密文" {
  let img = match split_image() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let vol = @ntfs.Volume::open(img, 0L) catch {
    _ => {
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
  let entry = match entry_named(entries, "secret.bin") {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let mut message = ""
  let data = @ntfs.read_file(img, vol, mft, entry.record_number) catch {
    err => {
      message = @ntfs.describe_error(err)
      Default::default()
    }
  }
  if data.length() != 0 {
    println("encrypted file returned " + data.length().to_string() + " byte(s)")
    assert_true(false)
    return
  }
  assert_eq(message, "encrypted: MFT record 7")
}

///|
/// 重解析点：能读出链接本身，但不跟随目标。
///
/// `link.txt` 指向 `\??\C:\Windows\notepad.exe`——那个文件不在这块镜像里。
/// 跟随它等于凭空造出一条镜像中并不存在的路径，所以语义是：报出 tag 与
/// 目标，拒绝继续。返回 0 字节是不行的，那会让调用方以为"文件是空的"。
test "重解析点：报出目标，不跟随镜像外路径" {
  let img = match split_image() {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let vol = @ntfs.Volume::open(img, 0L) catch {
    _ => {
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
  let entry = match entry_named(entries, "link.txt") {
    Some(v) => v
    None => {
      assert_true(false)
      return
    }
  }
  let rp = @ntfs.reparse_of(img, vol, mft, entry.record_number) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  match rp {
    Some(point) => {
      assert_eq(point.kind, "symlink")
      assert_eq(point.print_name, "\\??\\C:\\Windows\\notepad.exe")
    }
    None => {
      assert_true(false)
      return
    }
  }
  let mut message = ""
  let data = @ntfs.read_file(img, vol, mft, entry.record_number) catch {
    err => {
      message = @ntfs.describe_error(err)
      Default::default()
    }
  }
  assert_eq(data.length(), 0)
  assert_eq(
    message, "reparse point (symlink): \\??\\C:\\Windows\\notepad.exe -- not followed",
  )
}
