// moonfs — 纯 MoonBit 的只读文件系统镜像解析库
// 文档：https://docs.moonbitlang.com/en/latest/toolchain/moon/module.html

name = "wwt1733/moonfs"

version = "0.2.0"

readme = "README.md"

repository = "https://github.com/wwt1733/moonfs"

license = "Apache-2.0"

keywords = [ "filesystem", "ntfs", "ext4", "forensics", "disk-image", "wasm" ]

preferred_target = "wasm"

description = "Pure MoonBit, FFI-free NTFS/ext4 image parser — no mount, no root, runs on native, JS and WebAssembly."

import {
  "moonbitlang/x@0.5.7",
}
