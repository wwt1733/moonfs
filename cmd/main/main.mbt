///|
/// moonfs 命令行入口。
///
/// 用法：
///   moonfs info <image>
///   moonfs partitions <image>
fn usage() -> Unit {
  println("moonfs — read-only filesystem image inspector")
  println("")
  println("usage:")
  println(
    "  moonfs info <image>                 volume geometry and partition count",
  )
  println("  moonfs partitions <image>           partition table entries")
  println("  moonfs ls <image> [path]            list a directory (default /)")
  println("  moonfs cat <image> <path>           print a file's contents")
  println("  moonfs export <image> <path> <out>  extract a file to disk")
}

///|
fn format_size(bytes : Int64) -> String {
  if bytes >= 1073741824L {
    (bytes.to_double() / 1073741824.0).to_string() + " GiB"
  } else if bytes >= 1048576L {
    (bytes.to_double() / 1048576.0).to_string() + " MiB"
  } else if bytes >= 1024L {
    (bytes.to_double() / 1024.0).to_string() + " KiB"
  } else {
    bytes.to_string() + " B"
  }
}

///|
fn scheme_name(part : @partition.Partition) -> String {
  match part.scheme {
    Mbr => "mbr"
    Gpt => "gpt"
  }
}

///|
fn partition_error_text(err : @partition.PartitionError) -> String {
  match err {
    Io(reason~) => "cannot read partition table: " + reason
    BadSignature(found~) =>
      "no MBR signature at end of sector 0 (found 0x" + found.to_string() + ")"
    Corrupt(reason~) => reason
  }
}

///|
fn describe_partition(part : @partition.Partition) -> String {
  let mut line = "  #" + part.index.to_string() + "  " + scheme_name(part)
  if part.scheme is Gpt {
    line = line + "  " + part.type_guid
    if part.name != "" {
      line = line + "  \"" + part.name + "\""
    }
  } else {
    line = line +
      "  type=0x" +
      part.mbr_type.to_string() +
      (if part.bootable { "  [active]" } else { "" })
  }
  line +
  "  start=" +
  part.start_lba.to_string() +
  "  sectors=" +
  part.sector_count.to_string() +
  "  size=" +
  format_size(part.sector_count * 512L)
}

///|
/// 读入镜像文件。失败时返回一句人能看懂的话，而不是抛到调用栈上。
fn read_image(path : String) -> Result[@block.Image, String] {
  let bytes = @fs.read_file_to_bytes(path) catch {
    _ => return Err("cannot read " + path)
  }
  let img = @block.Image::from_bytes(bytes) catch {
    err => return Err(@block.reason_of(err))
  }
  Ok(img)
}

///|
/// 打印错误并以非零状态退出。
///
/// 退出码不是装饰：CI 和脚本靠它判断成败。只打印不退出会让调用方以为
/// 命令成功了，而实际上什么都没读到。
fn fail(message : String) -> Unit {
  println("error: " + message)
  let _ : Unit = @env.exit(1)
}

///|
fn cmd_partitions(path : String) -> Unit {
  match read_image(path) {
    Err(message) => fail(message)
    Ok(img) => {
      let result = Ok(@partition.read(img)) catch { e => Err(e) }
      match result {
        Err(err) => fail(partition_error_text(err))
        Ok(parts) =>
          if parts.length() == 0 {
            println("no partitions found")
          } else {
            for part in parts {
              println(describe_partition(part))
            }
          }
      }
    }
  }
}

///|
/// 把卷序列号格式化成 Windows 的 `dir` 那样：8 位十六进制，中间一个连字符。
fn hex_serial(serial : Int64) -> String {
  let chars : Array[Char] = []
  for i in 0..<8 {
    if i == 4 {
      chars.push('-')
    }
    let nibble = ((serial >> ((7 - i) * 4)) & 0xFL).to_int()
    let code = if nibble < 10 { 48 + nibble } else { 55 + nibble }
    if code.to_char() is Some(c) {
      chars.push(c)
    }
  }
  String::from_array(chars)
}

///|
fn cmd_info(path : String) -> Unit {
  match read_image(path) {
    Err(message) => fail(message)
    Ok(img) => {
      println("image:      " + path)
      println("size:       " + format_size(img.size()))
      println(
        "sectors:    " +
        img.sector_count().to_string() +
        " x " +
        img.sector_size().to_string() +
        " B",
      )
      let parts = @partition.read(img) catch { _ => [] }
      println("partitions: " + parts.length().to_string())
      for part in parts {
        // 逐分区尝试识别 NTFS 卷头；识别不出来不算错误，镜像里可能只有分区表
        let volume = @ntfs.Volume::open(img, part.start_lba) catch {
          _ => continue
        }
        println(
          "  #" +
          part.index.to_string() +
          " ntfs  cluster=" +
          volume.cluster_size.to_string() +
          " B  mft_record=" +
          volume.mft_record_size.to_string() +
          " B  index_record=" +
          volume.index_record_size.to_string() +
          " B  serial=" +
          hex_serial(volume.serial_number),
        )
      }
    }
  }
}

///|
fn main {
  let args = @env.args()
  if args.length() < 3 {
    usage()
    return
  }
  let command = args[1]
  let path = args[2]
  match command {
    "info" => cmd_info(path)
    "partitions" => cmd_partitions(path)
    "ls" => {
      let sub = if args.length() > 3 { args[3] } else { "/" }
      cmd_ls(path, sub)
    }
    "cat" => if args.length() > 3 { cmd_cat(path, args[3]) } else { usage() }
    "export" =>
      if args.length() > 4 {
        cmd_export(path, args[3], args[4])
      } else {
        usage()
      }
    _ => {
      println("unknown command: " + command)
      println("")
      usage()
    }
  }
}

///|
/// 尝试在指定扇区打开 NTFS 卷，失败返回 None。
fn try_volume(img : @block.Image, lba : Int64) -> @ntfs.Volume? {
  let vol = @ntfs.Volume::open(img, lba) catch { _ => return None }
  Some(vol)
}

///|
/// 在镜像里找 NTFS 卷：先看分区表，找不到就把整个镜像当作裸卷。
fn open_volume(img : @block.Image) -> Result[@ntfs.Volume, String] {
  let parts = @partition.read(img) catch { _ => [] }
  for part in parts {
    if try_volume(img, part.start_lba) is Some(vol) {
      return Ok(vol)
    }
  }
  match try_volume(img, 0L) {
    Some(vol) => Ok(vol)
    None => Err("no NTFS volume found in this image")
  }
}

///|
fn pad_right(text : String, width : Int32) -> String {
  let mut out = text
  while out.length() < width {
    out = out + " "
  }
  out
}

///|
fn ntfs_error_text(err : @ntfs.NtfsError) -> String {
  @ntfs.describe_error(err)
}

///|
/// 把一个路径解析成 MFT 记录号。根目录固定是 5。
///
/// 用 `Result` 而不是抛错：跨包不能构造 NTFS 的 suberror 变体，
/// 而且调用方需要区分"路径不存在"和"镜像坏了"。
fn resolve_path(
  img : @block.Image,
  vol : @ntfs.Volume,
  mft : @ntfs.Mft,
  path : String,
) -> Result[Int64, String] {
  let mut current = 5L
  for segment in path.split("/") {
    let name = segment.to_owned()
    if name == "" {
      continue
    }
    let entries = @ntfs.list_directory(img, vol, mft, current) catch {
      err => return Err(@ntfs.describe_error(err))
    }
    let mut found = false
    for entry in entries {
      if entry.name == name {
        current = entry.record_number
        found = true
        break
      }
    }
    if !found {
      return Err("no entry named \"" + name + "\" under " + path)
    }
  }
  Ok(current)
}

///|
fn describe_entry(
  img : @block.Image,
  vol : @ntfs.Volume,
  mft : @ntfs.Mft,
  entry : @ntfs.DirEntry,
) -> String {
  let info = @ntfs.stat_record(img, vol, mft, entry.record_number) catch {
    _ =>
      {
        number: entry.record_number,
        logical_size: entry.logical_size,
        allocated_size: entry.allocated_size,
        compressed: false,
        encrypted: false,
        sparse: false,
        is_directory: entry.is_directory(),
      }
  }
  let mut marks = ""
  if info.is_directory {
    marks = marks + " dir"
  }
  if info.compressed {
    marks = marks + " compressed"
    marks = marks + " (" + info.allocated_size.to_string() + " B allocated)"
  }
  if info.sparse {
    marks = marks + " sparse"
  }
  if info.encrypted {
    marks = marks + " encrypted"
  }
  pad_right(entry.name, 28) +
  pad_right(info.logical_size.to_string() + " B", 14) +
  marks
}

///|
fn cmd_ls(image_path : String, sub_path : String) -> Unit {
  match read_image(image_path) {
    Err(message) => fail(message)
    Ok(img) => {
      let vol = match open_volume(img) {
        Ok(v) => v
        Err(message) => {
          fail(message)
          return
        }
      }
      let mft = @ntfs.Mft::open(img, vol) catch {
        err => {
          fail(ntfs_error_text(err))
          return
        }
      }
      let number = match resolve_path(img, vol, mft, sub_path) {
        Ok(n) => n
        Err(message) => {
          fail(message)
          return
        }
      }
      let entries = @ntfs.list_directory(img, vol, mft, number) catch {
        err => {
          fail(ntfs_error_text(err))
          return
        }
      }
      for entry in entries {
        // "." 和 ".." 是目录自引用，不是子项；Windows 资源管理器也不显示
        if entry.name == "." || entry.name == ".." {
          continue
        }
        println(describe_entry(img, vol, mft, entry))
      }
    }
  }
}

///|
fn cmd_cat(image_path : String, sub_path : String) -> Unit {
  match read_image(image_path) {
    Err(message) => fail(message)
    Ok(img) => {
      let vol = match open_volume(img) {
        Ok(v) => v
        Err(message) => {
          fail(message)
          return
        }
      }
      let mft = @ntfs.Mft::open(img, vol) catch {
        err => {
          fail(ntfs_error_text(err))
          return
        }
      }
      let number = match resolve_path(img, vol, mft, sub_path) {
        Ok(n) => n
        Err(message) => {
          fail(message)
          return
        }
      }
      let data = @ntfs.read_file(img, vol, mft, number) catch {
        err => {
          fail(ntfs_error_text(err))
          return
        }
      }
      println(@utf8.decode_lossy(data))
    }
  }
}

///|
fn cmd_export(
  image_path : String,
  sub_path : String,
  out_path : String,
) -> Unit {
  match read_image(image_path) {
    Err(message) => fail(message)
    Ok(img) => {
      let vol = match open_volume(img) {
        Ok(v) => v
        Err(message) => {
          fail(message)
          return
        }
      }
      let mft = @ntfs.Mft::open(img, vol) catch {
        err => {
          fail(ntfs_error_text(err))
          return
        }
      }
      let number = match resolve_path(img, vol, mft, sub_path) {
        Ok(n) => n
        Err(message) => {
          fail(message)
          return
        }
      }
      let data = @ntfs.read_file(img, vol, mft, number) catch {
        err => {
          fail(ntfs_error_text(err))
          return
        }
      }
      @fs.write_bytes_to_file(out_path, data) catch {
        _ => {
          println("error: cannot write " + out_path)
          return
        }
      }
      println(
        "wrote " + out_path + " (" + data.length().to_string() + " bytes)",
      )
    }
  }
}
