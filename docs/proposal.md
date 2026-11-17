# moonfs 项目申报书

## 基本信息

- 项目名称：moonfs —— 纯 MoonBit 的只读文件系统镜像解析库（一期：NTFS 3.1）
- 参赛者：王文挺
- 联系方式：见报名问卷（公开仓库不放置个人手机号）
- GitHub 仓库：https://github.com/wwt1733/moonfs
- GitLink 仓库：https://gitlink.org.cn/wwt1733/moonfs（与 GitHub 同步）
- 项目方向：存储基础设施 / 文件系统解析
- 项目性质：原创实现（依据公开规范编写，非移植）

## 本轮修订

上一轮审核指出：既定范围排除了 NTFS 压缩读取，也未明确目标格式版本与完整读取终点，导致合法压缩文件的浏览与导出会在内容读取处中断。

本轮把**压缩与稀疏读取纳入一期并已完成实现**，补充了格式版本承诺与三层读取终点，并在下面用一块包含压缩文件的镜像逐条说明预期行为。仓库同步更新：`testdata/synth-ntfs.img` 由 `tools/make_test_image.py` 生成，评审可重跑脚本复核。

更重要的是**不再只在自己的合成镜像上自证**。本轮用 Windows 自带的 `diskpart` + `format fs=ntfs` + `compact /c` 造了一块真实 NTFS 3.1 卷（`testdata/win-ntfs.img`，24 MB，已入库），在这块卷上完成端到端验证。真实数据抓出了两个被合成镜像掩盖的问题：卷头 `clusters-per-index-buffer` 的字段偏移读错，以及 LZNT1 短语「长度位 / 距离位」的动态分栏被写死成固定值。两者都已修复，并把真实压缩块留作回归向量。

## 项目简介

moonfs 用纯 MoonBit 实现磁盘镜像上的文件系统解析，直接读取镜像字节，不挂载、不依赖任何 C 库。

目标用户是需要在非特权环境里访问镜像内容的人：在浏览器里分析用户上传的镜像、在 CI 里检查构建产出的根文件系统、在取证工作站上批量扫描上百块磁盘，或者在没有 root 的容器里做数据提取。

## 项目价值与生态定位

**痛点**：现在能解析 NTFS 的实现几乎都是 C 库——Linux 侧是 `ntfs-3g` 和内核 ext4 驱动，Windows 侧是 `libfsntfs`。它们要么需要挂载（要求 root 或管理员权限），要么必须链接原生 ABI。结果是：**在 WebAssembly 里没办法读一块磁盘镜像**。不是没人想做，是现有实现的形态决定了它们进不了 wasm。

**生态位**：MoonBit 的 `preferred_target` 可以是 wasm，而 wasm 里没有 FFI 可用的 C 库。moonfs 补的正是这个位置——一份不依赖原生 ABI 的文件系统解析实现，能在 native / js / wasm-gc 后端上跑同一份代码。这不是"把 C 库翻译一遍"，而是只有在纯 MoonBit 前提下才成立的能力。

**与已有项目的关系**：查过 mooncakes.io 全部 3794 个包，`ntfs` 与 `ext4` 相关实现数为 **0**。FAT 家族已有 `chenliyi-cly/moonfat`，因此本项目**不做 FAT**，后续通过统一的卷接口对接它，避免重复建设。

## 预期使用场景

1. **浏览器端镜像浏览（核心场景）**：用户在网页上传一块 `.img`，前端直接用 moonfs（wasm-gc 后端）列出分区、目录与文件内容，全程不上传服务器。现有 C 绑定方案在此场景不可行。
2. **数字取证**：打开 DD / E01 镜像，枚举卷上的文件并导出 MFT 时间戳做时间线，不需要挂载、不需要写权限，可以在只读介质上批量跑。
3. **CI 中的镜像内容校验**：构建完根文件系统镜像后，直接断言镜像里没有多余的调试文件、`/etc/shadow` 的权限位正确、关键二进制存在——不需要起容器、不需要挂载 loop 设备。
4. **教学与结构可视化**：把 MFT 记录、属性、runlist、压缩单元逐层打印出来，用于讲解文件系统内部结构。

## 目标格式版本

**NTFS 3.1**（Windows XP 起的默认版本，覆盖当前所有在用的 Windows）。版本号读自 `$VOLUME_INFORMATION` 属性；读到 3.0 / 1.2 卷时结构层仍可解析，但 `$Secure` 等后加元文件的语义不做承诺。

ext4 不在本期交付范围内。后续实现时不按"内核版本"声明支持，而是读超级块的 `compat` / `ro_compat` / `incompat` 特性位：**遇到未知的 `incompat` 位直接拒绝打开并报具体 flag**，不按最接近的布局去猜。

## 一期读取终点

"解析文件系统"没有边界就没有验收标准。一期终点分三层：

| 层 | 终点 | 判据 |
| --- | --- | --- |
| 元数据层 | 从镜像字节走到完整目录树 | 每个条目给出路径、逻辑大小、占用大小、时间戳、压缩/稀疏标志、MFT 记录号 |
| 内容层 | 任意文件 → 正确字节流 | 覆盖常驻、非常驻单段、非常驻多段、稀疏、LZNT1 压缩、尾部不足一压缩单元六种情形，读出内容与原文件逐字节相同 |
| 导出层 | CLI 能落盘 | `ls` 输出目录树、`cat` 输出内容、`export` 把文件还原到本地 |

## 压缩文件的预期行为

以 `testdata/synth-ntfs.img`（MBR + NTFS 3.1，根目录四个文件）为例：

| 文件 | 特征 | 逻辑大小 | 占用 |
| --- | --- | --- | --- |
| `hello.txt` | 常驻，未压缩 | 14 B | 14 B |
| `big.bin` | 非常驻，跨 2 簇 | 1000 B | 1024 B |
| `compressed.txt` | LZNT1 压缩，压缩单元 2 簇 | 1024 B | 512 B |
| `sparse.bin` | 稀疏，runlist 只有未分配段 | 512 B | 0 B |
| `split.bin` | `$DATA` 拆成两段，分放两条 MFT 记录 | 2000 B | 2048 B |

预期行为：

| 操作 | 预期输出 |
| --- | --- |
| `moonfs ls /` | 四个条目全部列出；压缩文件标 `compressed` 并同时显示逻辑大小与占用大小 |
| `moonfs cat /hello.txt` | 14 字节原文 |
| `moonfs cat /big.bin` | 1000 字节，跨簇拼接正确 |
| `moonfs cat /compressed.txt` | **1024 字节解压后的原文**，与压缩前逐字节一致 |
| `moonfs cat /sparse.bin` | 512 个零字节 |
| `moonfs cat /split.bin` | **2000 字节**，跨两条 MFT 记录的段按 VCN 顺序拼好 |
| `moonfs export .../compressed.txt out.bin` | 落盘 1024 字节，`sha256` 与原始文件一致 |
| 加密属性（EFS） | 返回 `Encrypted(path=...)`，退出码非零，**不输出密文** |
| `$ATTRIBUTE_LIST` 记录 | 自动合并，**不静默漏读属性** |
| 三个后端（native / js / wasm-gc） | 上述每条的输出与退出码完全一致 |

这张表已经写进 CI：每次 push 都在 wasm-gc 下真正执行 `export`，把解出的字节与生成器写入的值逐字节比对。

### 真实 Windows 卷上的实测

同一套代码读 `testdata/win-ntfs.img`（Windows 格式化、`compact /c` 压缩）：

```
$ moonfs info testdata/win-ntfs.img
  #0 ntfs  cluster=4096 B  mft_record=1024 B  index_record=4096 B  serial=5400-82D4

$ moonfs ls testdata/win-ntfs.img /
$MFT                        262144 B
big.txt                     204847 B       compressed (28672 B allocated)
mixed.bin                   196608 B       compressed (12288 B allocated)
plain.txt                   69 B           compressed (69 B allocated)
small.txt                   4 B            compressed (4 B allocated)
System Volume Information   0 B            dir
```

| 文件 | 写入内容 | 占用（`compact` / 本项目） | 导出后 SHA-256 |
| --- | --- | --- | --- |
| `big.txt` | 204847 B，79 字节一行重复 2593 次 | 28672 / 28672 B | 与写入时一致 |
| `mixed.bin` | 196608 B，64 KiB 确定字节 + 128 KiB 全零 | 12288 / 12288 B | 与写入时一致 |
| `plain.txt` | 69 B 常驻 | 69 / 69 B | 与写入时一致 |
| `small.txt` | 4 B 常驻 | 4 / 4 B | 与写入时一致 |

`tests/e2e/windows_test.mbt` 把这四个文件的内容在测试里重新算出来逐字节比对，因此 CI 每次都会验证真实 LZNT1 数据。

## 拟实现的核心功能（一期）

- 卷定位：MBR 与 GPT 分区表解析，含 GPT 头与分区项数组的 CRC 校验
- NTFS 元数据：卷头几何、MFT 记录与 Update Sequence Array 修复、属性链、`$ATTRIBUTE_LIST` 跨记录合并、runlist（含有符号增量与稀疏段）
- NTFS 目录：`$INDEX_ROOT` + `$INDEX_ALLOCATION` 的 `$I30` B+ 树遍历，Win32 / DOS 命名空间区分
- NTFS 数据：常驻、非常驻多段、稀疏（读作零）、**LZNT1 压缩单元解压**（含"原样存储"与"整单元未分配"两个分支）
- CLI：`info` / `partitions` / `ls` / `cat` / `export`

## 一期范围外

- **只读**。不写镜像、不改文件系统、不做日志重放。
- **不做数据恢复与删除文件找回**。
- **不做 EFS 解密**。需要用户证书与私钥，离线解析器拿不到，属物理上不可行；遇到即报错，不返回密文。
- **不做非常驻的 `$ATTRIBUTE_LIST`**。列表本身大到装不下簇时会被搬到卷上，这一层不做；常驻形式已支持合并。
- **ext4 不在本期交付范围内**。
- **不做挂载、不做内核集成、不做写回缓存**。

## 实现路径与技术理解

解析分三层，每层都能独立测试：

1. **字节层**（已完成）：定长整数读取，每次读取前校验 `[offset, offset+n)` 是否落在缓冲区内。镜像截断时必须在第一层报错，否则上层会把残缺结构解析成看起来合法的数据。
2. **定位层**（已完成）：分区表 → 卷起始偏移 → 卷头几何。NTFS 的难点是 `clusters_per_mft_record` 是**有符号**字节，值为负时表示 `2^-n` 字节；这一点错了，后面读 MFT 全部跑偏。GPT 必须先验 CRC 再用偏移，因为 CRC 不过的头部字段可能指向镜像任意位置。
3. **结构层**（已完成）：MFT 记录 → USA 修复 → 属性 → runlist → 数据。四个最容易出错的点：USA 不先修复则跨扇区字段全错；runlist 的 LCN 是**有符号增量**，按无符号读会得到天文数字的簇号；目录索引项的文件引用是自己而不是 `$FILE_NAME` 里的父目录；压缩单元存在"压缩后更大所以原样存储"的分支，漏掉会把原文当 LZNT1 解并输出垃圾。

**验证方式**：LZNT1 用固定向量单独测（未压缩块、短语回溯、重叠复制、多块拼接、越界报错），其中一条向量直接取自真实 Windows 卷；镜像用脚本生成，评审可重跑；端到端断言在三个后端各跑一遍；CI 在 wasm-gc 下真正执行 `export` 并逐字节比对。

## 当前进度

仓库已建，CI 在跑，`moon test` **63 个用例在 native / js / wasm-gc 三个后端全绿**（native 由 CI 在 ubuntu 上验证）：

- 字节层、`Image` 镜像访问、MBR / GPT 分区表、NTFS 卷头
- MFT 记录与 USA 修复、属性链遍历、runlist 解码（含稀疏段与有符号增量）
- `$I30` 目录枚举，`ls` 已在 wasm-gc 下读出四个条目的名字与大小
- 常驻 / 非常驻多段 / 稀疏 / LZNT1 压缩四种数据路径，`cat` 与 `export` 在 wasm-gc 下实测输出与原文件逐字节一致
- **真实 Windows 卷**（`testdata/win-ntfs.img`）上四个文件全部读出，SHA-256 与写入时一致；压缩块作为回归向量内嵌在单元测试里
- `tools/make_test_image.py` 生成合成镜像，`tools/make_windows_image.ps1` 生成真实镜像，两者都可重跑
