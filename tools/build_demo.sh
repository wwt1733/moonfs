#!/usr/bin/env bash
# 生成 docs/demo 的两块产物：
#   api.js      —— 编译器输出，页面直接当普通脚本加载（没有 import，双击也能跑）
#   samples.js  —— 内置示例镜像（NTFS 原样，ext4 gzip 后 base64）
set -eu

here=$(cd "$(dirname "$0")/.." && pwd)
cd "$here"
export PATH="$HOME/.moon/bin:$PATH"

moon build web/api --target js --release
cp _build/js/release/build/web/api/api.js docs/demo/api.js

python - <<'PY'
import base64, gzip, io

ntfs = base64.b64encode(open("testdata/synth-ntfs.img", "rb").read()).decode()
ext4 = base64.b64encode(gzip.compress(open("testdata/ext4.img", "rb").read(), 9)).decode()
with io.open("docs/demo/samples.js", "w", encoding="utf-8", newline="\n") as f:
    f.write("// 由 tools/build_demo.sh 生成，不要手改。\n")
    f.write("// ntfs 是原始字节的 base64；ext4gz 是 gzip 之后再做 base64（16 MiB 压到几十 KB）。\n")
    f.write("window.SAMPLES = {\n  ntfs: \"%s\",\n  ext4gz: \"%s\"\n};\n" % (ntfs, ext4))
print("samples.js: ntfs %d chars, ext4gz %d chars" % (len(ntfs), len(ext4)))
PY

ls -la docs/demo/
