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
  println("  moonfs info <image>        volume geometry and partition count")
  println("  moonfs partitions <image>  partition table entries")
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
fn cmd_partitions(path : String) -> Unit {
  match read_image(path) {
    Err(message) => println("error: " + message)
    Ok(img) => {
      let result = Ok(@partition.read(img)) catch { e => Err(e) }
      match result {
        Err(err) => println("error: " + partition_error_text(err))
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
fn cmd_info(path : String) -> Unit {
  match read_image(path) {
    Err(message) => println("error: " + message)
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
          " B  mft_lcn=" +
          volume.mft_lcn.to_string(),
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
    _ => {
      println("unknown command: " + command)
      println("")
      usage()
    }
  }
}
