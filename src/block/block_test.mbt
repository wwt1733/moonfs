///|
fn sample_image(bytes : Int32) -> @block.Image raise {
  @block.Image::from_bytes(Bytes::makei(bytes, i => i.to_byte()))
}

///|
test "default sector size is 512" {
  let img = sample_image(1024)
  assert_eq(img.sector_size(), 512)
  assert_eq(img.size(), 1024L)
  assert_eq(img.sector_count(), 2L)
}

///|
test "unsupported sector size is rejected" {
  let data = Bytes::makei(4096, i => i.to_byte())
  let result = Ok(@block.Image::from_bytes(data, sector_size=600)) catch {
    e => Err(e)
  }
  assert_true(result is Err(@block.InvalidSectorSize(_)))
}

///|
test "custom sector size changes sector count" {
  let img = @block.Image::from_bytes(
    Bytes::makei(4096, i => i.to_byte()),
    sector_size=4096,
  )
  assert_eq(img.sector_count(), 1L)
}

///|
test "read returns the requested window" {
  let img = sample_image(2048)
  assert_eq(img.read(1L, 3), b"\x01\x02\x03")
}

///|
test "read past the end raises instead of truncating" {
  let img = sample_image(512)
  let result = Ok(img.read(500L, 20)) catch { e => Err(e) }
  assert_true(result is Err(@block.OutOfBounds(_)))
}

///|
test "negative offset is rejected" {
  let img = sample_image(512)
  let result = Ok(img.read(-1L, 4)) catch { e => Err(e) }
  assert_true(result is Err(@block.OutOfBounds(_)))
}

///|
test "read_sector returns exactly one sector" {
  let img = sample_image(2048)
  let sector = img.read_sector(1L)
  assert_eq(sector.length(), 512)
  assert_eq(sector.at(0), (0).to_byte())
}

///|
test "read_sectors spans consecutive sectors" {
  let img = sample_image(2048)
  let region = img.read_sectors(1L, 2L)
  assert_eq(region.length(), 1024)
}
