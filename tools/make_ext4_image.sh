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
# truncate 只能改已有 inode，所以先用空文件占位。
debugfs -w -R "write /dev/null sparse.bin" "$out" >/dev/null
debugfs -w -R "truncate sparse.bin 100000" "$out" >/dev/null
debugfs -w -R "symlink link.txt target-of-link" "$out" >/dev/null

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
debugfs -R "ls -l /" "$out" 2>/dev/null

echo
echo "== sub 目录 =="
debugfs -R "ls -l /sub" "$out" 2>/dev/null

echo
echo "== 各文件块映射（真值用于核对 extent）=="
for f in big.bin hello.txt sub/nested.txt sparse.bin; do
  echo "-- $f"
  debugfs -R "blocks /$f" "$out" 2>/dev/null || true
done

echo
echo "== 文件内容 sha256 =="
for f in hello.txt big.bin sub/nested.txt sparse.bin; do
  debugfs -R "dump /$f $tmp/out.bin" "$out" >/dev/null 2>&1 || true
  printf '  %-16s %s\n' "$f" "$(sha256sum "$tmp/out.bin" | cut -d' ' -f1)"
done

echo
echo "== 镜像 sha256 =="
sha256sum "$out"
ls -l "$out"
