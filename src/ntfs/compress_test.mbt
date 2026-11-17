///|
/// 造一块 2048 字节的镜像，把 `payload` 写到 `at` 偏移处。
fn cz_image(payload : Array[Int32], at : Int32) -> @block.Image raise {
  let arr : FixedArray[Byte] = FixedArray::make(2048, Byte::default())
  let mut i = 0
  for v in payload {
    arr[at + i] = (v & 0xFF).to_byte()
    i = i + 1
  }
  @block.Image::from_bytes(Bytes::from_array(arr), sector_size=512)
}

///|
/// 造一个 cluster_size = 512 的卷。
fn cz_volume() -> @ntfs.Volume {
  {
    bytes_per_sector: 512,
    sectors_per_cluster: 1,
    cluster_size: 512,
    total_sectors: 4L,
    mft_lcn: 1L,
    mft_mirror_lcn: 2L,
    mft_record_size: 1024,
    index_record_size: 4096,
    base_offset: 0L,
    serial_number: 0L,
  }
}

///|
/// 造一个压缩属性描述。
fn cz_attr(
  compression_unit : Int32,
  data_size : Int64,
  allocated_size : Int64,
) -> @ntfs.Attribute {
  {
    type_code: 0x80L,
    total_length: 0x48,
    non_resident: true,
    name: "",
    flags: 0x0001L,
    id: 1L,
    value: Default::default(),
    lowest_vcn: 0L,
    highest_vcn: 0L,
    runlist_offset: 0,
    compression_unit,
    allocated_size,
    data_size,
    initialized_size: data_size,
  }
}

///|
test "整单元稀疏时读出全零" {
  let img = cz_image([], 0) catch { _ => return }
  let vol = cz_volume()
  let attr = cz_attr(0, 512L, 0L)
  let runs : Array[@ntfs.Run] = [
    { vcn: 0L, lcn: -1L, clusters: 1L, sparse: true, },
  ]
  let data = @ntfs.read_compressed(img, vol, attr, runs) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(data.length(), 512)
  let mut all_zero = true
  for i in 0..<512 {
    if data.at(i).to_int() != 0 {
      all_zero = false
    }
  }
  assert_true(all_zero)
}

///|
test "单元占满时按原样存储返回，不当 LZNT1 解" {
  // 512 个 0x41；如果误当 LZNT1 解，0x41 会被读成块头，结果完全不同
  let payload : Array[Int32] = []
  for _ in 0..<512 {
    payload.push(0x41)
  }
  let img = cz_image(payload, 512) catch { _ => return }
  let vol = cz_volume()
  let attr = cz_attr(0, 512L, 512L)
  let runs : Array[@ntfs.Run] = [
    { vcn: 0L, lcn: 1L, clusters: 1L, sparse: false, },
  ]
  let data = @ntfs.read_compressed(img, vol, attr, runs) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(data.length(), 512)
  assert_eq(data.at(0).to_int(), 0x41)
  assert_eq(data.at(511).to_int(), 0x41)
}

///|
test "单元未占满时走 LZNT1 解压" {
  // 压缩单元 4 簇（2048 字节），实际只占 1 簇，压缩数据解出 4 个 'A'
  let img = cz_image([0x05, 0xB0, 0x02, 0x41, 0x00, 0x00], 512) catch {
    _ => return
  }
  let vol = cz_volume()
  let attr = cz_attr(2, 4L, 512L)
  let runs : Array[@ntfs.Run] = [
    { vcn: 0L, lcn: 1L, clusters: 1L, sparse: false, },
  ]
  let data = @ntfs.read_compressed(img, vol, attr, runs) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(data.length(), 4)
  assert_eq(data.at(0).to_int(), 0x41)
  assert_eq(data.at(1).to_int(), 0x41)
  assert_eq(data.at(2).to_int(), 0x41)
  assert_eq(data.at(3).to_int(), 0x41)
}

///|
test "多个单元按顺序拼接并各自解压" {
  // 两个压缩单元各占 1 簇，各自解出一个 4 字节的 "AAAA"
  // 单元大小 = 1 簇（compression_unit = 0），因此每单元对应一个 run，
  // 但 run 占满整个单元就会走原样分支，所以这里用稀疏与数据混合：
  // 单元 0 是数据，单元 1 是稀疏，data_size 覆盖两个单元
  let img = cz_image([0x41, 0x42, 0x43, 0x44], 512) catch { _ => return }
  let vol = cz_volume()
  let attr = cz_attr(0, 1024L, 512L)
  let runs : Array[@ntfs.Run] = [
    { vcn: 0L, lcn: 1L, clusters: 1L, sparse: false, },
    { vcn: 1L, lcn: -1L, clusters: 1L, sparse: true, },
  ]
  let data = @ntfs.read_compressed(img, vol, attr, runs) catch {
    _ => {
      assert_true(false)
      return
    }
  }
  assert_eq(data.length(), 1024)
  // 第一个单元是原样存储的 512 字节
  assert_eq(data.at(0).to_int(), 0x41)
  assert_eq(data.at(3).to_int(), 0x44)
  // 第二个单元稀疏，全零
  assert_eq(data.at(512).to_int(), 0)
  assert_eq(data.at(1023).to_int(), 0)
}
