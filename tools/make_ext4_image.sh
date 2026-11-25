#!/usr/bin/env bash
# 生成 ext4 测试镜像。必须在 Linux（含 WSL）下跑，需要 e2fsprogs：
#   mke2fs / debugfs / dumpe2fs / e2fsck
#
# 用法（Windows 侧）：
#   wsl -e bash /mnt/f/moonbit/moonfs/tools/make_ext4_image.sh
#
# 为什么不在仓库里放一块手写的镜像：NTFS 那次的教训是，自己写的编码器与
# 自己的解码器共用同一个误解时，测试会互相印证。这里所有结构都由
# mke2fs / debugfs 生成，是外部真值。
#
# 内容全部可复算：
#   hello.txt      14 B   "hello, moonfs\n"
#   big.bin    300000 B   21 字节图案重复，第 30..40 块被 punch 成空洞
#   sub/nested.txt 100 B  "nested-XXXX" 行重复
#   sparse.bin 100000 B   全空洞（truncate 出来，没有数据块）
#   link.txt             符号链接，目标 "target-of-link"
set -eu

here=$(cd "$(dirname "$0")/.." && pwd)
out="$here/testdata/ext4.img"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

echo "== 生成 $out =="
rm -f "$out"
dd if=/dev/zero of="$out" bs=1M count=16 status=none
mke2fs -t ext4 -F -q -O ^has_journal "$out"

# 载荷：图案固定，MoonBit 侧按同样公式复算
yes 'moonfs-ext4-fixture' | head -c 300000 > "$tmp/big.bin"
printf 'hello, moonfs\n' > "$tmp/hello.txt"
yes 'nested-line' | head -c 100 > "$tmp/nested.txt"

echo "== 写入文件（debugfs，不需要 root）=="
debugfs -w -R "write $tmp/hello.txt hello.txt" "$out" >/dev/null
debugfs -w -R "write $tmp/big.bin big.bin" "$out" >/dev/null
debugfs -w -R "mkdir /sub" "$out" >/dev/null
debugfs -w -R "write $tmp/nested.txt sub/nested.txt" "$out" >/dev/null
# 100000 字节、零个数据块：extent 树是空的，读出来必须是全零。
# truncate 只缩不扩，所以建空文件后直接改 i_size。
debugfs -w -R "write /dev/null sparse.bin" "$out" >/dev/null
debugfs -w -R "set_inode_field sparse.bin size 100000" "$out" >/dev/null 2>&1 \
  || debugfs -w -R "set_inode_field sparse.bin i_size 100000" "$out" >/dev/null 2>&1 \
  || echo "(设置 sparse.bin size 失败)"
debugfs -w -R "symlink link.txt target-of-link" "$out" >/dev/null

# 预分配但未写入的段：ee_len 的最高位置 1，读出来必须是零而不是磁盘上的旧数据
yes 'unwritten-fixture-payload' | head -c 20000 > "$tmp/unwritten.bin"
debugfs -w -R "write $tmp/unwritten.bin unwritten.bin" "$out" >/dev/null
debugfs -w -R "fallocate unwritten.bin 0 4" "$out" >/dev/null 2>&1 \
  || echo "(fallocate 不可用，unwritten.bin 会是普通数据)"

# 400 个条目把目录顶过 4 KiB，dir_index 会把它转成 htree
printf 'x' > "$tmp/one.bin"
debugfs -w -R "mkdir /many" "$out" >/dev/null
: > "$tmp/cmds"
for i in $(seq -w 0 399); do echo "write $tmp/one.bin many/f$i"; done > "$tmp/cmds"
debugfs -w -f "$tmp/cmds" "$out" >/dev/null

# 在第 30..40 块挖洞，逼出「一个文件多个 extent + 中间有洞」
debugfs -w -R "punch big.bin 30 40" "$out" >/dev/null

echo "== e2fsck 只读校验 =="
e2fsck -fn "$out" 2>&1 | tail -5 || true

echo
echo "== dumpe2fs =="
dumpe2fs -h "$out" 2>/dev/null | egrep \
  "Block count|Block size|Inode count|Inode size|Filesystem features|First block|Blocks per group|Inodes per group|Filesystem UUID|Filesystem state"

echo
echo "== 根目录 =="
debugfs -R "ls /" "$out" 2>&1 | grep -v "^debugfs "

echo
echo "== sub 目录 =="
debugfs -R "ls /sub" "$out" 2>&1 | grep -v "^debugfs "

echo
echo "== 特殊 inode 的 stat（大小与 extent 形状）=="
for f in sparse.bin unwritten.bin many; do
  echo "-- $f"
  debugfs -R "stat /$f" "$out" 2>&1 | egrep -i "Size|EXTENTS|Uninit|Flags" | head -8 || true
done

echo
echo "== many 目录前几条（400 个条目应把目录顶过 4 KiB）=="
debugfs -R "ls /many" "$out" 2>&1 | grep -v "^debugfs " | head -5

echo
echo "== 各文件块映射（真值用于核对 extent）=="
for f in big.bin hello.txt sub/nested.txt sparse.bin; do
  echo "-- $f"
  debugfs -R "blocks /$f" "$out" 2>/dev/null || true
done

echo
echo "== 文件内容 sha256 =="
for f in hello.txt big.bin sub/nested.txt sparse.bin unwritten.bin; do
  debugfs -R "dump /$f $tmp/out.bin" "$out" >/dev/null 2>&1 || true
  printf '  %-16s %s\n' "$f" "$(sha256sum "$tmp/out.bin" | cut -d' ' -f1)"
done

echo
echo "== 镜像 sha256 =="
sha256sum "$out"
ls -l "$out"
