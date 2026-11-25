# moonfs

**Pure MoonBit, FFI-free read-only filesystem image parser. NTFS 3.1 and ext4 both read today.**

在浏览器里直接打开一块磁盘镜像，列出目录、读出文件——不需要挂载、不需要 root、不需要一个 C 库。

用包：

```
moon add wwt1733/moonfs
```

从源码跑（含测试与两块测试镜像，能重放 `testdata/` 里的镜像）：

```
git clone https://github.com/wwt1733/moonfs
cd moonfs && moon test
```

> 命名空间 `wwt1733` 对应 GitHub 账户，当前版本 0.3.0，已发布到 mooncakes.io。

## 为什么需要它

现存的文件系统解析实现几乎都绑定在 C 库上：Linux 侧是 `ntfs-3g`（GPL）和内核的 ext4 驱动，Windows 侧是 `libfsntfs`。这些方案有三个绕不过去的问题：

1. **无法进入 WebAssembly。** C 绑定必须依赖原生 ABI，而 MoonBit 的主力场景之一正是 wasm / wasm-gc。想在浏览器里分析一块镜像，目前没有可用方案。
2. **需要特权。** 挂载镜像要求 root 或管理员权限，容器和 CI 环境里通常拿不到。
3. **行为不统一。** 同一份解析代码在 native、JS、wasm 上的结果是否一致，没有统一答案。

moonfs 用纯 MoonBit 实现镜像层与文件系统层的字节解析，不依赖 FFI，因此同一份代码可以在 native / JS / wasm-gc 后端上跑，并且可以在没有特权、没有挂载点的前提下直接读取镜像内容。

## 分层结构

解析分三层，每层只依赖上一层的输出，换一层不影响其他层：

| 层 | 包 | 职责 | 可替换点 |
| --- | --- | --- | --- |
| 字节层 | `@block` | 镜像当只读字节源，越界即报错 | 数据源换成文件 / 内存 / wasm 宿主内存 |
| 定位层 | `@partition` | MBR / GPT → 卷起始偏移 | 裸卷传 0，分区内卷传 `start_lba` |
| 结构层 | `@ntfs` / `@ext4` | 卷内结构 → 目录树与文件流 | 换文件系统只换这一层 |

两条路径都在 CI 里：`testdata/synth-ntfs.img` 是裸卷（引导扇区在偏移 0），`testdata/win-ntfs.img` 是分区内卷（MBR，起点 LBA 128），同一个 `Volume::open` 各跑一遍。

## 当前进度

这是 0.3.0 的状态，进度如实列出：

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| `src/binio` | 已完成 | 小端/大端定长整数读取，带边界检查 |
| `src/checksum` | 已完成 | crc32 / crc32c，对标准校验向量 |
| `src/block` | 已完成 | 镜像字节源、扇区对齐访问、越界保护 |
| `src/partition` | 已完成 | MBR 分区表、GPT 头与分区项（含 CRC32 校验） |
| `src/ntfs` | **已完成** | 卷头、MFT 记录与 USA 修复、属性链、`$ATTRIBUTE_LIST` 合并（含非常驻列表）、runlist、`$I30` 目录枚举、数据流、LZNT1 解压、稀疏段 |
| `src/ext4` | **只读核心已完成** | 超级块与 feature 白名单、块组描述符、inode、extent 树、目录、数据流 |
| `cmd/main` | NTFS 已完成 | CLI：`info` / `partitions` / `ls` / `cat` / `streams` / `export`；ext4 目前只有库 API，没接 CLI |

未完成的部分不会在文档里写成"已支持"。

## 支持矩阵

| 能力 | NTFS | ext4 |
| --- | --- | --- |
| 分区表定位（MBR / GPT） | 是 | 是（同一层，与文件系统无关） |
| 卷头 / 超级块 | 是 | 是（`incompat` 白名单） |
| MFT / inode 遍历 | 是 | 是（含 64 位块号） |
| 目录枚举 | 是（`$I30` B+ 树） | 是（线性扫描，htree 目录同路径） |
| 常驻数据 | 是 | 是（含内联在 `i_block` 的符号链接目标） |
| 多段数据 | 是（runlist） | 是（extent 树，深度上限 5） |
| 稀疏 / 洞 | 是（读作零） | 是（洞与未初始化段都读作零） |
| 压缩 | LZNT1 解压 | 不适用（ext4 无内置压缩） |
| 加密内容 | EFS 返回 `Encrypted`，不吐密文 | 加密 inode 拒绝读取 |
| 命名数据流（ADS） | 是（列出并单独读出） | 不适用 |
| 重解析点 / 符号链接 | 报 tag 与目标，不跟随 | 读出链接目标，但不跟随 |
| 卷版本 | `$VOLUME_INFORMATION`（`info` 打印） | 不适用（按 feature 位判定） |

## ext4 验证方式（可重放）

`testdata/ext4.img` 由 `tools/make_ext4_image.sh` 生成——`mke2fs` 建卷、`debugfs` 写文件、`e2fsck -D` 把大目录转成 htree。全部由 e2fsprogs 完成，不是手写字节：自己写的编码器和自己的解码器共用同一个误解时，测试会互相印证。

```
wsl -e bash tools/make_ext4_image.sh    # 或任意 Linux + e2fsprogs
```

| 对象 | 形状 | 断言 |
| --- | --- | --- |
| `hello.txt` | 14 B 常驻 | 内容等于 `hello, moonfs\n` |
| `big.bin` | 300000 B，逻辑块 30..40 被 punch | 4 段 extent，逐字节等于图案，洞读出零 |
| `sparse.bin` | 100000 B、零个数据块 | 读出 100000 个零（extent 树为空） |
| `unwritten.bin` | 40000 B、一段未初始化 extent | 读出全零；单元测试里那个块塞满 `0x5A`，照读就会露 |
| `sub/nested.txt` | 子目录 | 逐级解析，100 B 内容正确 |
| `link.txt` | 快符号链接 | 目标存 `i_block`，读出 `target-of-link` |
| `many/` | 400 个文件，`e2fsck -D` 转成 htree | 402 个条目全列出，`f123` 可读 |

超级块 12 个字段与 `dumpe2fs` 逐项相等；inode 号、extent 形状与 `debugfs` 的 `stat` / `blocks` 对齐。

**不做**：ext2 风格的旧式块映射（无 extents）直接拒绝；htree 不做哈希查找，走线性扫描；journal 不重放，`needs_recovery` 只作为标志暴露。

## 目标格式版本

**NTFS：目标是 3.1**（Windows XP 起的默认版本，覆盖当前所有在用的 Windows）。版本号读自 `$VOLUME_INFORMATION` 属性。读到 3.0 / 1.2 卷时结构层仍可解析，但 `$Secure` 等后加的元文件语义不做承诺。

**ext4：按 feature flag 判定，而不是按内核版本。** ext4 磁盘格式是一组特性位的组合，实现读超级块的 `compat` / `ro_compat` / `incompat`，`incompat` 走白名单——遇到不认识的位直接拒绝打开并报 `UnsupportedFeature`，而不是按最接近的布局去猜。代价是少数合法卷（`META_BG`、`INLINE_DATA` 等）会被拒；读出错误内容还不报错，比读不了严重。

## 一期读取终点

"解析文件系统"这句话没有边界就没有验收标准。一期的终点分三层：

| 层 | 终点 | 判据 |
| --- | --- | --- |
| 元数据层 | 从镜像字节走到完整目录树 | 每个条目给出名字、MFT 记录号与序列号、逻辑 / 占用大小、三个时间戳、压缩 / 稀疏标志；路径由名字逐级拼出 |
| 内容层 | 任意文件 → 正确字节流 | 覆盖常驻、非常驻单段、非常驻多段、稀疏、LZNT1 压缩、尾部不足一压缩单元六种情形，读出内容与原文件逐字节相同 |
| 导出层 | CLI 能落盘 | `ls` 输出目录树、`cat` 输出内容、`export` 把文件还原到本地 |

## 一期范围外

边界写死，避免"大而全"导致的半成品：

- **只读。** 不写镜像、不改文件系统、不做日志重放（`$LogFile` / ext4 journal）。
- **不做数据恢复与删除文件找回。** 那是另一个问题域。
- **不做 EFS 解密。** 需要用户的证书与私钥，任何离线镜像解析器都拿不到，因此这是物理上不可行，而非实现偷懒。遇到加密属性返回 `Encrypted` 并带上路径，不返回密文冒充内容。
- **不跟随重解析点。** 符号链接与目录联接的目标可能是 `\??\C:\Windows` 这种镜像之外的路径，跟过去等于凭空造出一条镜像里并不存在的路径。能读到的是链接本身：tag、substitute name、print name，原样交回调用方，由它决定要不要解释。
- **不做 ext4 htree 的哈希查找。** 条目按 `rec_len` 线性扫描，htree 目录也一样走这条路径（已在 fixture 上验证）；不实现按哈希定位，慢但正确。
- **不做挂载、不做内核集成、不做写回缓存。**

## 使用

```moonbit
// 读一块镜像的分区表
let img = @block.Image::from_bytes(bytes)
let parts = @partition.read(img)

// 打开 NTFS 卷与它的 MFT
let vol = @ntfs.Volume::open(img, parts[0].start_lba)
let mft = @ntfs.Mft::open(img, vol)

// 列根目录（根目录固定是记录号 5）
let entries = @ntfs.list_directory(img, vol, mft, 5L)

// 按记录号读文件内容（压缩、稀疏、多段都在这个入口下面处理）
let data = @ntfs.read_file(img, vol, mft, entries[0].record_number)
```

上面是骨架。完整可运行版本在 `examples/walk`：递归走完整棵树，打印每个文件的标志、时间戳与命名流。

```
$ moon run examples/walk -- testdata/synth-ntfs.img
/  (22 KiB, cluster 512 B)
/big.bin  1000 B
/compressed.txt  1024 B
/deep.bin  2000 B
/hello.txt  14 B
    :meta  9 B
/sparse.bin  512 B
/split.bin  2000 B
```

这个示例在 CI 里每次 push 都跑，而且 wasm-gc 与 js 两后端的输出要逐行 `diff`——示例跑不起来或者后端输出不一致，CI 会红。

ext4 走同一套字节层，入口换成超级块：

```moonbit
// 裸卷传 0；分区内卷传所在分区的起始 LBA
let sb = @ext4.Superblock::open(img, 0L)

// 按路径解析到 inode，再读内容
let inode = @ext4.resolve_path(img, sb, "/sub/nested.txt")
let body = @ext4.read_inode_data(img, sb, inode)
```

ext4 目前只到库 API，没有 CLI 子命令；能读什么、边界在哪，见上面的支持矩阵与「ext4 验证方式」。

命令行：

```
moonfs info <image>                 卷几何、NTFS 版本与分区数
moonfs partitions <image>           分区表条目
moonfs ls <image> [path]            列目录
moonfs cat <image> <path>[:stream]  输出默认流或命名数据流
moonfs streams <image> <path>       列出命名数据流（ADS）
moonfs export <image> <path> <out>  把文件解出到本地
```

`ls` 对压缩文件同时显示逻辑大小与占用大小。下面是**真实 Windows 卷**上的输出（wasm-gc 后端）：

```
$ moonfs info testdata/win-ntfs.img
image:      testdata/win-ntfs.img
size:       24 MiB
sectors:    49152 x 512 B
partitions: 1
  #0 ntfs 3.1  cluster=4096 B  mft_record=1024 B  index_record=4096 B  serial=5400-82D4

$ moonfs ls testdata/win-ntfs.img /
$MFT                        262144 B
big.txt                     204847 B       compressed (28672 B allocated)
mixed.bin                   196608 B       compressed (12288 B allocated)
plain.txt                   69 B           compressed (69 B allocated)
small.txt                   4 B            compressed (4 B allocated)
System Volume Information   0 B            dir
```

占用大小按 runlist 里非稀疏簇的合计算，与 `compact` 报告的一致。属性头里另有一个「按压缩单元取整的虚拟分配」（`big.txt` 上是 262144），照它显示会让压缩文件看起来比原文还占地方。

三个后端构建与测试：

```
moon check
moon test
moon test --target js
moon test --target wasm-gc
```

## 验证方式

正确性不靠"看起来对"：

- **在真实 Windows 卷上验证。** `testdata/win-ntfs.img` 是 Windows 自己造出来的 NTFS 3.1 卷：`tools/make_windows_image.ps1` 用 `diskpart` 建固定 VHD、`format fs=ntfs` 格式化、写入四个文件、`compact /c` 施加真正的 LZNT1 压缩，再截掉 VHD 尾部 512 字节 footer 得到裸镜像。`tests/e2e/windows_test.mbt` 把四个文件的内容**在测试里重新算出来**逐字节比对，其中 `big.txt` 是 79 字节一行的 2593 次重复、经 LZNT1 压缩后只剩 28672 字节。
- **算法单独钉死。** LZNT1 解压是纯函数，测试里内嵌了一段**从上面那块 Windows 卷里切出来的压缩块**（419 字节负载，还原 4096 字节）。这一条来自一次真实事故：早期实现把短语的"长度位/距离位"写死成 4/12 分栏，而合成镜像的编码器犯了同一个错，两边互相印证、测试全绿——直到真实数据进来才暴露。真实向量现在钉住了这个位置。
- **镜像可重放。** `testdata/synth-ntfs.img` 由 `tools/make_test_image.py` 生成，22 KiB 的 NTFS 3.1 裸卷，根目录下六个文件，覆盖常驻、非常驻多段、LZNT1 压缩、稀疏、跨记录合并（列表常驻）、跨记录合并（列表非常驻）六条数据路径。评审可以重跑脚本并比对字节，不必相信一个来路不明的二进制。
- **跨记录属性的样本。** `split.bin` 的 `$DATA` 被拆成两段、分放在两条 MFT 记录和两个不相邻的簇上，靠常驻的 `$ATTRIBUTE_LIST` 串起来；`deep.bin` 更进一步，列表自己也搬到簇上，成为非常驻属性。只读主记录不会报错——会给出一半内容，所以两条都断言 2000 字节全对。
- **MFT 自身被拆段。** `testdata/synth-mft-split.img` 由 `tools/make_split_mft_image.py` 生成：`$MFT` 的 `$DATA` 分成 LCN 10..17 与 20..27 两段，列表非常驻，根目录记录 5 与文件记录 6 都在第二段里。要读它们必须先解开「读扩展记录要 MFT、MFT 布局又在 MFT 里」这个循环——列表带着自己的 runlist，按普通数据读即可。回退修复后这条测试会报 `MFT runs = 1`。同一镜像里还有一个 `secret.bin`（EFS 加密标志）：读取必须抛 `Encrypted` 并带上路径，测试断言返回零字节——把密文当内容返回会让调用方以为读成功了。
- **命名数据流与重解析点。** `hello.txt` 上挂了一个 `:meta` 流：`streams` 要列出来、`cat /hello.txt:meta` 要读出 9 字节，而默认流仍是 14 字节——两件事都得对。`link.txt` 是指向 `\??\C:\Windows\notepad.exe` 的符号链接，那个文件不在镜像里：`ls` 标 `reparse:symlink`，`cat` 必须报错并给出目标，不能返回 0 字节冒充空文件。
- **跨后端一致。** 同一套端到端断言（`tests/e2e`）在 native / JS / wasm-gc 三个后端各跑一遍。CI 还会在 wasm-gc 下真正执行 `export`，把解出的内容与生成器写入的值逐字节比对——如果压缩解压只在 native 正确，这一步会挂。
- **CLI 输出跨后端逐行比对。** `ls` 与 `info` 在 wasm-gc 与 js 下各跑一次，`diff` 必须为空。这条不是形式主义：js 的 `process.argv` 会把解释器与脚本路径带进来，早先的 `main` 假定子命令固定在 `argv[1]`，在 js 上第一条命令就报 `unknown command`，而 wasm-gc 一切正常——不比对就发现不了。
- **版本号来自磁盘，不是常量。** `$VOLUME_INFORMATION` 读出来的 3.1 在合成镜像与真实 Windows 卷上都要成立；后者是 Windows 自己写的值。
- **与外部实现对照。** `compact` 报告 `big.txt` 占用 28672 字节、`mixed.bin` 占用 12288 字节，与本项目从 runlist 算出的物理占用一致；`ls` 的逻辑大小、压缩标志也与 Windows 侧写入的值一致。

## 参考与许可

本项目为原创实现，依据公开规范编写：

- NTFS 结构：[linux-ntfs 文档](https://flatcap.github.io/linux-ntfs/ntfs/) 与 Microsoft `[MS-FSCC]` / `[MS-DOS]` 公开规范
- LZNT1 压缩算法：`[MS-XCA]` 中的 LZNT1 规范
- ext4 结构：Linux 内核 `Documentation/filesystems/ext4/`
- 设计上参考了 Rust `ntfs` crate（MIT）与 `ext4-view` 的模块划分思路，**未复制其代码**

FAT12/16/32 不在本项目范围内，已有 [`chenliyi-cly/moonfat`](https://mooncakes.io/docs/chenliyi-cly/moonfat) 实现，后续通过统一的卷接口对接。

Apache License 2.0，见 [LICENSE](LICENSE)。
