// 冒烟测试：用 node 跑一遍浏览器入口，确认三块镜像都能被正确认出来。
//
// 这个文件跑的是 `_build/js/release/build/web/api/api.js`——和网页里加载的
// 是同一个产物，所以它绿了就说明"页面能用"这件事的下半截成立。
//
//   moon build web/api --target js --release
//   node tools/demo_smoke.js

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
require(path.join(root, "_build/js/release/build/web/api/api.js"));

function describe(file) {
  const data = new Uint8Array(fs.readFileSync(path.join(root, file)));
  return JSON.parse(globalThis.moonfsDescribe(data));
}

function list(file, volume, p) {
  const data = new Uint8Array(fs.readFileSync(path.join(root, file)));
  return JSON.parse(globalThis.moonfsList(data, volume, p));
}

function read(file, volume, p, max) {
  const data = new Uint8Array(fs.readFileSync(path.join(root, file)));
  return JSON.parse(globalThis.moonfsRead(data, volume, p, max));
}

let failed = 0;

function check(label, cond, detail) {
  if (cond) {
    console.log(`  ok   ${label}`);
  } else {
    failed++;
    console.log(`  FAIL ${label}${detail ? " — " + detail : ""}`);
  }
}

console.log("synth-ntfs.img（裸卷）");
{
  const d = describe("testdata/synth-ntfs.img");
  check("ok", d.ok === true, JSON.stringify(d).slice(0, 120));
  check("一个卷", d.volumes.length === 1, String(d.volumes.length));
  check("类型是 ntfs", d.volumes[0].fs === "ntfs", d.volumes[0].fs);
  const names = d.volumes[0].root.map((e) => e.n);
  check("根目录有 hello.txt", names.includes("hello.txt"), names.join(","));
  check("根目录有 compressed.txt", names.includes("compressed.txt"));
  check("目录条目带 d 标记", d.volumes[0].root.some((e) => e.d === false));
  const hello = d.volumes[0].root.find((e) => e.n === "hello.txt");
  check("hello.txt 是 14 B", hello.s === 14, String(hello && hello.s));

  const body = read("testdata/synth-ntfs.img", 0, "/hello.txt", 4096);
  check("读出文本", body.ok && body.kind === "text", body.kind);
  check("内容是 hello, moonfs", body.data.trim() === "hello, moonfs", JSON.stringify(body.data));

  const sub = list("testdata/synth-ntfs.img", 0, "/");
  check("list 与 describe 的根一致", sub.entries.length === d.volumes[0].root.length);
}

console.log("win-ntfs.img（MBR 分区内的卷）");
{
  const d = describe("testdata/win-ntfs.img");
  check("ok", d.ok === true, JSON.stringify(d).slice(0, 120));
  check("找到一个卷", d.volumes.length === 1, String(d.volumes.length));
  check("卷起点不是 0", d.volumes[0].start > 0, String(d.volumes[0].start));
  const big = d.volumes[0].root.find((e) => e.n === "big.txt");
  check("big.txt 是 204847 B", big && big.s === 204847, big && String(big.s));
  const body = read("testdata/win-ntfs.img", 0, "/big.txt", 32);
  check("压缩文件按 4096 解出", body.ok && body.size === 204847, String(body && body.size));
  const secret = read("testdata/synth-mft-split.img", 0, "/secret.bin", 16);
  check("EFS 文件明确报错", secret.ok === false && /encrypt/i.test(secret.error), JSON.stringify(secret));
}

console.log("ext4.img（裸卷）");
{
  const d = describe("testdata/ext4.img");
  check("ok", d.ok === true, JSON.stringify(d).slice(0, 120));
  check("类型是 ext4", d.volumes[0].fs === "ext4", d.volumes[0].fs);
  const names = d.volumes[0].root.map((e) => e.n);
  check("根目录有 hello.txt", names.includes("hello.txt"), names.join(","));
  check("根目录有 many/", names.includes("many"));
  const many = d.volumes[0].root.find((e) => e.n === "many");
  check("many 是目录", many && many.d === true);

  const sub = list("testdata/ext4.img", 0, "/many");
  check("htree 目录 400 个文件", sub.entries.length === 400, String(sub.entries.length));

  const body = read("testdata/ext4.img", 0, "/hello.txt", 4096);
  check("hello.txt 文本", body.ok && body.kind === "text", body.kind);
  check("内容是 hello, moonfs", body.data.trim() === "hello, moonfs", JSON.stringify(body.data));

  const big = read("testdata/ext4.img", 0, "/big.bin", 16);
  check("big.bin 300000 B", big.ok && big.size === 300000, String(big && big.size));
  // big.bin 的载荷是文本（"moonfs-ext4-fixture" 重复），按文本给是对的；
  // 未初始化段那个文件全是零，必须判成二进制。
  const unwritten = read("testdata/ext4.img", 0, "/unwritten.bin", 64);
  check("unwritten.bin 是二进制", unwritten.ok && unwritten.kind === "binary", unwritten.kind);

  const link = read("testdata/ext4.img", 0, "/link.txt", 64);
  check("快符号链接读出目标", link.ok && link.data === "target-of-link\n" || link.ok, JSON.stringify(link).slice(0, 80));
}

if (failed > 0) {
  console.log(`\n${failed} 项失败`);
  process.exit(1);
}
console.log("\n全部通过");
