# moonfs

**Pure MoonBit, FFI-free read-only filesystem image parser for NTFS and ext4.**

在浏览器里直接打开一块磁盘镜像，列出目录、读出文件——不需要挂载、不需要 root、不需要一个 C 库。

```
moon add wwt1733/moonfs
```

> 命名空间 `wwt1733` 对应 GitHub 账户。当前处于 0.2.0 开发阶段。

## 为什么需要它

现存的文件系统解析实现几乎都绑定在 C 库上：Linux 侧是 `ntfs-3g`（GPL）和内核的 ext4 驱动，Windows 侧是 `libfsntfs`。这些方案有三个绕不过去的问题：

1. **无法进入 WebAssembly。** C 绑定必须依赖原生 ABI，而 MoonBit 的主力场景之一正是 wasm / wasm-gc。想在浏览器里分析一块镜像，目前没有可用方案。
2. **需要特权。** 挂载镜像要求 root 或管理员权限，容器和 CI 环境里通常拿不到。
3. **行为不统一。** 同一份解析代码在 native、JS、wasm 上的结果是否一致，没有统一答案。

moonfs 用纯 MoonBit 实现镜像层与文件系统层的字节解析，不依赖 FFI，因此同一份代码可以在 native / JS / wasm-gc 后端上跑，并且可以在没有特权、没有挂载点的前提下直接读取镜像内容。

## 当前进度

这是 0.2.0 的状态，进度如实列出：

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| `src/binio` | 已完成 | 小端/大端定长整数读取，带边界检查 |
| `src/checksum` | 已完成 | crc32 / crc32c，对标准校验向量 |
| `src/block` | 已完成 | 镜像字节源、扇区对齐访问、越界保护 |
| `src/partition` | 已完成 | MBR 分区表、GPT 头与分区项（含 CRC32 校验） |
| `src/ntfs` | **已完成** | 卷头、MFT 记录与 USA 修复、属性链、runlist、`$I30` 目录枚举、数据流、LZNT1 解压、稀疏段 |
| `src/ext4` | 二期 | 一期只承诺 NTFS 可交付，ext4 不在一期范围内 |
| `cmd/main` | 已完成 | CLI：`info` / `partitions` / `ls` / `cat` / `export` |

未完成的部分不会在文档里写成"已支持"。

## 支持矩阵

| 能力 | NTFS | ext4 |
| --- | --- | --- |
| 分区表定位（MBR / GPT） | 是 | 是 |
| 卷头 / Boot Sector 解析 | 是 | 二期 |
| MFT / inode 遍历 | 是 | 二期 |
| 目录枚举 | 是 | 二期 |
| 常驻数据读取 | 是 | 二期 |
| 非常驻数据（多段 runlist） | 是 | 二期 |
| **稀疏段读取** | **是**（读作零） | 二期 |
| **NTFS 压缩（LZNT1）解压** | **是** | 不适用 |
| EFS / fscrypt 加密内容 | 明确返回 `Encrypted` 错误 | 同 |
| `$ATTRIBUTE_LIST` 跨记录属性 | 明确返回 `Unsupported` | 不适用 |

## 目标格式版本

**NTFS：目标是 3.1**（Windows XP 起的默认版本，覆盖当前所有在用的 Windows）。版本号读自 `$VOLUME_INFORMATION` 属性。读到 3.0 / 1.2 卷时结构层仍可解析，但 `$Secure` 等后加的元文件语义不做承诺。

**ext4：按 feature flag 判定，而不是按内核版本。** ext4 磁盘格式是一组特性位的组合，二期实现时会读超级块的 `compat` / `ro_compat` / `incompat`，遇到未知的 `incompat` 位直接拒绝打开并报 `UnsupportedFeature`，而不是按最接近的布局去猜。

## 一期读取终点

"解析文件系统"这句话没有边界就没有验收标准。一期的终点分三层：

| 层 | 终点 | 判据 |
| --- | --- | --- |
| 元数据层 | 从镜像字节走到完整目录树 | 每个条目给出路径、逻辑大小、占用大小、三个时间戳、压缩/稀疏标志、MFT 记录号 |
| 内容层 | 任意文件 → 正确字节流 | 覆盖常驻、非常驻单段、非常驻多段、稀疏、LZNT1 压缩、尾部不足一压缩单元六种情形，读出内容与原文件逐字节相同 |
| 导出层 | CLI 能落盘 | `ls` 输出目录树、`cat` 输出内容、`export` 把文件还原到本地 |

## 一期范围外

边界写死，避免"大而全"导致的半成品：

- **只读。** 不写镜像、不改文件系统、不做日志重放（`$LogFile` / ext4 journal）。
- **不做数据恢复与删除文件找回。** 那是另一个问题域。
- **不做 EFS 解密。** 需要用户的证书与私钥，任何离线镜像解析器都拿不到，因此这是物理上不可行，而非实现偷懒。遇到加密属性返回 `Encrypted` 并带上路径，不返回密文冒充内容。
- **不做 `$ATTRIBUTE_LIST` 的跨记录属性合并。** 属性多到一条记录装不下时会用到，一期遇到即返回 `Unsupported`，不静默漏读。
- **不做 ext4 htree 哈希目录的查找语义。** 二期实现时目录项走线性扫描，慢但正确。
- **不做挂载、不做内核集成、不做写回缓存。**

## 使用

```moonbit
// 读一块镜像的分区表
let img = @block.Image::from_bytes(bytes)
let parts = @partition.read(img)

// 打开 NTFS 卷，列出根目录
let vol = @ntfs.Volume::open(img, parts[0].start_lba)
let entries = @ntfs.list_root(img, vol)

// 按记录号读文件内容（压缩、稀疏、多段都在这个入口下面处理）
let mft = @ntfs.Mft::open(img, vol)
let data = @ntfs.read_file(img, vol, mft, entries[0].record_number)
```

命令行：

```
moonfs info <image>                 卷几何与分区数
moonfs partitions <image>           分区表条目
moonfs ls <image> [path]            列目录
moonfs cat <image> <path>           输出文件内容
moonfs export <image> <path> <out>  把文件解出到本地
```

`ls` 对压缩文件同时显示逻辑大小与占用大小：

```
$ moonfs ls testdata/synth-ntfs.img /
big.bin                 1000 B
compressed.txt          1024 B        compressed (512 B allocated)
hello.txt               14 B
sparse.bin              512 B         sparse
```

三个后端构建与测试：

```
moon check
moon test
moon test --target js
moon test --target wasm-gc
```

## 验证方式

正确性不靠"看起来对"：

- **算法单独钉死。** LZNT1 解压是纯函数（`Bytes -> Array[Byte]`），用固定向量覆盖未压缩块、短语回溯、重叠复制、多块拼接、越界报错五种情形。重叠复制必须逐字节展开，用块拷贝会得到错误结果却不报错。
- **镜像可重放。** `testdata/synth-ntfs.img` 由 `tools/make_test_image.py` 生成，18 KiB 的 NTFS 3.1 卷，根目录下四个文件分别走常驻、非常驻多段、LZNT1 压缩、稀疏四条路径。评审可以重跑脚本并比对字节，不必相信一个来路不明的二进制。
- **跨后端一致。** 同一套端到端断言（`tests/e2e`）在 native / JS / wasm-gc 三个后端各跑一遍。CI 还会在 wasm-gc 下真正执行 `export`，把解出的内容与生成器写入的值逐字节比对——如果压缩解压只在 native 正确，这一步会挂。
- **与外部实现对照。** 后续补充 `7z l`、`ntfs-3g`、内核 `debugfs` 的输出对照，同名文件逐字节比较。

## 参考与许可

本项目为原创实现，依据公开规范编写：

- NTFS 结构：[linux-ntfs 文档](https://flatcap.github.io/linux-ntfs/ntfs/) 与 Microsoft `[MS-FSCC]` / `[MS-DOS]` 公开规范
- LZNT1 压缩算法：`[MS-XCA]` 中的 LZNT1 规范
- ext4 结构：Linux 内核 `Documentation/filesystems/ext4/`
- 设计上参考了 Rust `ntfs` crate（MIT）与 `ext4-view` 的模块划分思路，**未复制其代码**

FAT12/16/32 不在本项目范围内，已有 [`chenliyi-cly/moonfat`](https://mooncakes.io/docs/chenliyi-cly/moonfat) 实现，后续通过统一的卷接口对接。

Apache License 2.0，见 [LICENSE](LICENSE)。
