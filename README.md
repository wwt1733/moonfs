# moonfs

**Pure MoonBit, FFI-free read-only filesystem image parser for NTFS and ext4.**

在浏览器里直接打开一块磁盘镜像，列出目录、读出文件——不需要挂载、不需要 root、不需要一个 C 库。

```
moon add WWT1733/moonfs
```

> 命名空间 `WWT1733` 对应 GitHub 账户。当前处于 0.1.0 开发阶段。

## 为什么需要它

现存的文件系统解析实现几乎都绑定在 C 库上：Linux 侧是 `ntfs-3g`（GPL）和内核的 ext4 驱动，Windows 侧是 `libfsntfs`。这些方案有三个绕不过去的问题：

1. **无法进入 WebAssembly。** C 绑定必须依赖原生 ABI，而 MoonBit 的主力场景之一正是 wasm / wasm-gc。想在浏览器里分析一块镜像，目前没有可用方案。
2. **需要特权。** 挂载镜像要求 root 或管理员权限，容器和 CI 环境里通常拿不到。
3. **行为不统一。** 同一份解析代码在 native、JS、wasm 上的结果是否一致，没有统一答案。

moonfs 用纯 MoonBit 实现镜像层与文件系统层的字节解析，不依赖 FFI，因此同一份代码可以在 native / JS / wasm / wasm-gc 四个后端上跑，并且可以在没有特权、没有挂载点的前提下直接读取镜像内容。

## 当前进度

这是 0.1.0 的在建状态，进度如实列出：

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| `src/binio` | 已完成 | 小端/大端定长整数读取，带边界检查 |
| `src/block` | 已完成 | 镜像字节源、扇区对齐访问、越界保护 |
| `src/partition` | 已完成 | MBR 分区表、GPT 头与分区项（含 CRC32 校验） |
| `src/ntfs` | 进行中 | Boot Sector / BPB 解析已完成，MFT 与属性解析开发中 |
| `src/ext4` | 规划中 | Superblock、块组描述符、inode 与 extent tree |
| `cmd/main` | 进行中 | CLI：`info` / `partitions` |

未完成的部分不会在文档里写成"已支持"。

## 支持矩阵

| 能力 | NTFS | ext4 |
| --- | --- | --- |
| 分区表定位（MBR / GPT） | 是 | 是 |
| 卷头 / Boot Sector 解析 | 是 | 规划中 |
| MFT / inode 遍历 | 开发中 | 规划中 |
| 目录枚举 | 规划中 | 规划中 |
| 文件内容读取 | 规划中 | 规划中 |

## 明确不做的事

范围写死，避免"大而全"导致的半成品：

- **只读。** 不写镜像、不改文件系统、不做日志重放。
- **不做 NTFS 压缩与 EFS 解密。** 遇到压缩属性返回明确的 `Unsupported` 错误，而不是返回错误数据。
- **不做 ext4 htree 哈希目录的查找语义。** 目录项走线性扫描，宁可慢但正确。
- **不做数据恢复与删除文件找回。** 那是另一个问题域。
- **不做挂载、不做内核集成、不做写回缓存。**

## 使用

```moonbit
// 读一块镜像的分区表
let img = @block.Image::from_bytes(bytes)
let parts = @partition.list(img)

// 打开 NTFS 卷，读取卷信息
let vol = @ntfs.Volume::open(img, parts[0].start_lba)
println(vol.cluster_size())
```

四个后端构建与测试：

```
moon check
moon test
moon test --target js
moon test --target wasm-gc
```

## 验证方式

正确性不靠"看起来对"：

- 用 `mkfs.ntfs` / `mkfs.ext4` 生成已知内容的镜像，逐字段断言卷头与元数据；
- 与 `7z l`、`ntfs-3g`、内核 `debugfs` 的输出做对照，同名文件的内容逐字节比对；
- 固定样本镜像进仓库前先做去标识化，不提交任何真实用户数据。

## 参考与许可

本项目为原创实现，依据公开规范编写：

- NTFS 结构：[linux-ntfs 文档](https://flatcap.github.io/linux-ntfs/ntfs/) 与 Microsoft `[MS-FSCC]` / `[MS-DOS]` 公开规范
- ext4 结构：Linux 内核 `Documentation/filesystems/ext4/`
- 设计上参考了 Rust `ntfs` crate（MIT）与 `ext4-view` 的模块划分思路，**未复制其代码**

FAT12/16/32 不在本项目范围内，已有 [`chenliyi-cly/moonfat`](https://mooncakes.io/docs/chenliyi-cly/moonfat) 实现，后续通过统一的卷接口对接。

Apache License 2.0，见 [LICENSE](LICENSE)。
