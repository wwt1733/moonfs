# 真实 Windows 卷验证记录

这份记录对应 `testdata/win-ntfs.img`：一块由 Windows 自己格式化、自己压缩的 NTFS 3.1 卷。它不是本项目生成的镜像，因此不会跟本项目的实现共享误解。

## 生成方式

```powershell
# 管理员 PowerShell
Set-ExecutionPolicy -Scope Process Bypass -Force
& "tools\make_windows_image.ps1"
```

脚本只操作一个临时固定 VHD：`create vdisk` → `attach` → `create partition primary` → `format fs=ntfs quick` → 写四个文件 → `compact /c`（逐个文件，不递归整卷）→ `detach` → 截掉 VHD 尾部 512 字节 footer，得到裸镜像。

## 写入与压缩结果（Windows 侧）

```
plain.txt            69 :        69 =  1.0 到 1 [OK]
small.txt             4 :         4 =  1.0 到 1 [OK]
big.txt          204847 :     28672 =  7.1 到 1 [OK]
mixed.bin        196608 :     12288 = 16.0 到 1 [OK]
```

`big.txt` 是 79 字节一行文本的 2593 次重复；`mixed.bin` 是前 64 KiB 确定字节加后 128 KiB 全零。

## 本项目的解析结果

```
$ moonfs info testdata/win-ntfs.img
image:      testdata/win-ntfs.img
size:       24 MiB
sectors:    49152 x 512 B
partitions: 1
  #0 ntfs  cluster=4096 B  mft_record=1024 B  index_record=4096 B  serial=5400-82D4

$ moonfs ls testdata/win-ntfs.img /
$AttrDef                    2560 B
$BadClus                    0 B
$Bitmap                     736 B
$Boot                       8192 B
$Extend                     0 B            dir
$LogFile                    2097152 B
$MFT                        262144 B
$MFTMirr                    4096 B
$Secure                     0 B
$UpCase                     131072 B
$Volume                     0 B
big.txt                     204847 B       compressed (28672 B allocated)
mixed.bin                   196608 B       compressed (12288 B allocated)
plain.txt                   69 B           compressed (69 B allocated)
small.txt                   4 B            compressed (4 B allocated)
System Volume Information   0 B            dir
```

占用大小与 `compact` 报告的一致。属性头 `0x28` 里另有一个 262144（按压缩单元取整的虚拟分配），照它显示会让压缩文件看起来比原文还占地方，因此本项目按 runlist 里非稀疏簇的合计算物理占用。

## 内容比对

| 文件 | 大小 | SHA-256（Windows 侧 / 导出后） |
| --- | --- | --- |
| `plain.txt` | 69 B | 一致 |
| `small.txt` | 4 B | 一致 |
| `big.txt` | 204847 B | 一致 |
| `mixed.bin` | 196608 B | 一致 |

完整哈希见 `testdata/win-ntfs.manifest.txt`。`tests/e2e/windows_test.mbt` 更进一步：它不读 manifest，而是在测试里把四个文件的期望内容重新算出来逐字节比对，所以 CI 每次都会覆盖真实 LZNT1 数据。

## 真实数据抓出的两个 bug

合成镜像（`tools/make_test_image.py`）此前一直是绿的，但它是本项目自己写的编码器产出的，编码器和解码器可以共享同一个误解。换成真实数据后暴露了两处：

1. **卷头 `clusters-per-index-buffer` 读错了偏移。** 正确位置是 `0x44`，之前读成 `0x41`（那三个字节是未使用区，Windows 写 0）。合成镜像恰好把 `0x41` 也写成有效值，于是测试一直通过；真实卷上 `record_size(0)` 被判为非法编码，整块卷打不开。

2. **LZNT1 短语的位分栏被写死。** 短语 token 的低位是长度、高位是距离，但**分栏宽度随块内已产出长度变化**：距离位宽 `d = max(4, ceil(log2(pos)))`，长度占 `16-d` 位。之前的实现固定 4/12，在块内前 16 字节之后就会解错。更糟的是仓库里的 Python 编码器犯了同一个错，两边互相「印证」。

修复后，真实卷第一块压缩数据（419 字节负载 → 4096 字节输出）被内嵌为单元测试向量；Python 编码器也按同一规范重写，并逐字节反向校验。
