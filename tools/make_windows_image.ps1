# moonfs - 造一块真实的 Windows 格式化 NTFS 镜像
#
# 为什么需要这个脚本：
#   合成镜像（tools/make_test_image.py）能验证解析逻辑，但它不是 Windows
#   自己格式化出来的卷。要在"合法压缩文件"上做端到端验证，最好用 Windows
#   的 compact 命令产生真正的 LZNT1 压缩，再整盘抓成 raw 镜像。
#
# 安全性：
#   全程只操作一个临时 VHD 文件，不碰任何物理磁盘。diskpart 里只会出现
#   "create vdisk / select vdisk / attach / detach"，没有 select disk。
#
# 用法（必须以管理员身份运行）：
#   1. 开始菜单搜 PowerShell -> 右键 -> 以管理员身份运行
#   2. 粘贴执行：
#        Set-ExecutionPolicy -Scope Process Bypass -Force
#        & "F:\moonbit\moonfs\tools\make_windows_image.ps1"
#   3. 跑完把最后打印的几行发回来
#
# 关于调用原生命令（踩过的坑）：
#   Windows PowerShell 5.1 里直接 `命令 2>&1` 会把 stderr 的每一行包成
#   ErrorRecord；在 $ErrorActionPreference='Stop' 下这就成了终止错误，
#   哪怕命令其实只是打了条警告。所以下面所有原生命令都走 `cmd /c`，
#   把重定向交给 cmd 处理，PowerShell 只看到 stdout。

$ErrorActionPreference = 'Stop'

# ---------- 0. 权限检查 ----------
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host ""
    Write-Host "需要管理员权限。" -ForegroundColor Red
    Write-Host "当前 PowerShell 没有提升。请关闭它，从开始菜单右键 PowerShell 选『以管理员身份运行』后重试。" -ForegroundColor Yellow
    exit 1
}

# ---------- 1. 参数 ----------
$sizeMB   = 24
$vhdPath  = Join-Path $env:TEMP "moonfs-test.vhd"
$dpScript = Join-Path $env:TEMP "moonfs-diskpart.txt"
$imgOut   = "F:\moonbit\moonfs\testdata\win-ntfs.img"
$manifest = "F:\moonbit\moonfs\testdata\win-ntfs.manifest.txt"
$drive    = "V:"
$targets  = @("plain.txt", "small.txt", "big.txt", "mixed.bin")

Write-Host ""
Write-Host "=== moonfs 真实镜像生成 ===" -ForegroundColor Cyan
Write-Host "VHD:    $vhdPath"
Write-Host "输出:   $imgOut"
Write-Host "大小:   ${sizeMB} MB"
Write-Host ""

# ---------- 2. 清理旧现场 ----------
if (Test-Path $vhdPath) { Remove-Item $vhdPath -Force }
if (Test-Path $drive) {
    Write-Host "警告：$drive 已被占用，请先释放该盘符" -ForegroundColor Yellow
    exit 1
}

# ---------- 3. 创建并挂载 VHD，格式化 NTFS ----------
$dp = @"
create vdisk file="$vhdPath" maximum=$sizeMB type=fixed
select vdisk file="$vhdPath"
attach vdisk
create partition primary
format fs=ntfs quick label=MOONFS
assign letter=V
"@
Set-Content -Path $dpScript -Value $dp -Encoding ascii
$out = cmd /c "diskpart /s `"$dpScript`" 2>&1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "diskpart 失败：" -ForegroundColor Red
    $out | Write-Host
    exit 1
}
Write-Host "VHD 已创建并格式化" -ForegroundColor Green

# 内容哈希辅助：用来验证"压缩后再读取"没有改变任何一个字节
function Get-StringSha256([string]$text) {
    $bytes = [Text.Encoding]::ASCII.GetBytes($text)
    $sha = [Security.Cryptography.SHA256]::Create()
    try {
        return ([BitConverter]::ToString($sha.ComputeHash($bytes)) -replace '-', '').ToLower()
    } finally { $sha.Dispose() }
}

try {
    # ---------- 4. 写测试文件 ----------
    # 刻意覆盖四种情形：
    #   plain.txt  普通小文件，小于一个压缩单元，走常驻路径
    #   big.txt    高重复度文本，压缩率很高，会真正走 LZNT1
    #   mixed.bin  前段确定字节 + 后段全零，落在"原样存储"与压缩的边界上
    #   small.txt  极小文件，验证常驻数据路径

    $plain = "moonfs windows fixture`r`nThis file is small enough to stay resident.`r`n"
    [IO.File]::WriteAllText("$drive\plain.txt", $plain, [Text.Encoding]::ASCII)

    $small = "hi`r`n"
    [IO.File]::WriteAllText("$drive\small.txt", $small, [Text.Encoding]::ASCII)

    # 200 KiB 重复文本：压缩后应该只剩几 KiB
    $line = "moonfs compression fixture line - the quick brown fox jumps over the lazy dog`r`n"
    $sb = New-Object Text.StringBuilder
    while ($sb.Length -lt (200 * 1024)) { [void]$sb.Append($line) }
    $big = $sb.ToString()
    [IO.File]::WriteAllText("$drive\big.txt", $big, [Text.Encoding]::ASCII)

    # 192 KiB：前 64 KiB 是确定字节，后 128 KiB 是零
    $buf = New-Object byte[] (192 * 1024)
    for ($i = 0; $i -lt (64 * 1024); $i++) { $buf[$i] = [byte](($i * 37 + 11) -band 0xFF) }
    [IO.File]::WriteAllBytes("$drive\mixed.bin", $buf)

    Write-Host "测试文件已写入" -ForegroundColor Green

    # ---------- 5. 设置 NTFS 压缩 ----------
    # 只压我们自己的四个文件，不做 /s: 整卷递归。
    # 整卷递归会走进 System Volume Information —— 那是连管理员默认都被
    # 拒绝访问的系统目录，compact 会对它报错并返回非零码。我们要的是
    # 这四个文件的压缩标志，跟系统目录无关。
    # compact 对普通文件默认使用 LZNT1，正是本项目实现的算法；这里刻意
    # 不用 CompactOS（那是 XPRESS4K，另一套算法，不在范围内）。
    Write-Host ""
    Write-Host "--- compact /c ---" -ForegroundColor Cyan
    foreach ($name in $targets) {
        $p = Join-Path "$drive\" $name
        $line = cmd /c "compact /c `"$p`" 2>&1"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "compact 失败: $name" -ForegroundColor Red
            $line | Write-Host
            throw "compact failed on $name"
        }
        $line | Write-Host
    }

    # big.txt / mixed.bin 必须真的被压缩，否则这次验证没有意义
    foreach ($name in @("big.txt", "mixed.bin")) {
        $item = Get-Item (Join-Path "$drive\" $name)
        if (($item.Attributes -band [IO.FileAttributes]::Compressed) -eq 0) {
            throw "$name 没有被压缩，端到端验证将退化成普通文件读取"
        }
    }
    Write-Host "压缩标志已确认" -ForegroundColor Green

    # ---------- 6. 查询实际压缩情况 ----------
    Write-Host ""
    Write-Host "--- compact /q ---" -ForegroundColor Cyan
    foreach ($name in $targets) {
        $p = Join-Path "$drive\" $name
        cmd /c "compact /q `"$p`" 2>&1" | Write-Host
    }
    Write-Host ""

    # ---------- 7. 生成 manifest（文件名 / 大小 / 压缩 / SHA256）----------
    # 哈希在卸载之前算：此时读到的是解压后的内容，正是"正确原文"的基准。
    $expected = @{
        "plain.txt" = Get-StringSha256 $plain
        "small.txt" = Get-StringSha256 $small
        "big.txt"   = Get-StringSha256 $big
    }
    $sha = [Security.Cryptography.SHA256]::Create()
    try {
        $expected["mixed.bin"] = ([BitConverter]::ToString($sha.ComputeHash($buf)) -replace '-', '').ToLower()
    } finally { $sha.Dispose() }

    $rows = @()
    foreach ($name in $targets) {
        $path = Join-Path "$drive\" $name
        $item = Get-Item $path
        $hash = (Get-FileHash $path -Algorithm SHA256).Hash.ToLower()
        $isCompressed = (($item.Attributes -band [IO.FileAttributes]::Compressed) -ne 0)

        if ($hash -ne $expected[$name]) {
            throw "$name 压缩后内容与写入时不一致：$hash != $($expected[$name])"
        }

        $flag = "no"
        if ($isCompressed) { $flag = "yes" }
        $rows += "{0}`t{1}`t{2}`t{3}" -f $name, $item.Length, $flag, $hash
        Write-Host ("{0,-12} {1,8} bytes  compressed={2}  {3}" -f $name, $item.Length, $flag, $hash)
    }
} finally {
    # 无论成功失败都要卸载 VHD，否则会留下一个挂着的虚拟盘
    # ---------- 8. 卸载 ----------
    $detach = @"
select vdisk file="$vhdPath"
detach vdisk
"@
    Set-Content -Path $dpScript -Value $detach -Encoding ascii
    cmd /c "diskpart /s `"$dpScript`" 2>&1" | Out-Null
    Start-Sleep -Seconds 1
}

# ---------- 9. 截掉 VHD 尾部 footer，得到 raw 镜像 ----------
# 固定型 VHD 的布局就是「裸数据 + 尾部 512 字节 footer」，去掉尾部即可
# 当作 raw 镜像使用，不需要 qemu-img 转换。
$srcLen = (Get-Item $vhdPath).Length
if ($srcLen -le 512) {
    Write-Host "VHD 文件异常，长度 $srcLen" -ForegroundColor Red
    exit 1
}
$payload = $srcLen - 512

$src = [IO.File]::OpenRead($vhdPath)
$dst = [IO.File]::Create($imgOut)
try {
    $buffer = New-Object byte[] (1MB)
    $remaining = $payload
    while ($remaining -gt 0) {
        $want = [Math]::Min($buffer.Length, $remaining)
        $read = $src.Read($buffer, 0, $want)
        if ($read -le 0) { break }
        $dst.Write($buffer, 0, $read)
        $remaining -= $read
    }
} finally {
    $dst.Close()
    $src.Close()
}

# ---------- 10. 校验 raw 镜像 ----------
$imgItem = Get-Item $imgOut
$boot = New-Object byte[] 512
$fs = [IO.File]::OpenRead($imgOut)
try { [void]$fs.Read($boot, 0, 512) } finally { $fs.Close() }
$mbrSig = "{0:X2}{1:X2}" -f $boot[510], $boot[511]
$imgHash = (Get-FileHash $imgOut -Algorithm SHA256).Hash.ToLower()

# manifest 里额外记录镜像本身的哈希，便于之后比对是否被改动
$rows += "# image`t{0}`t{1}`t{2}" -f $imgItem.Length, $mbrSig, $imgHash
Set-Content -Path $manifest -Value $rows -Encoding ascii

Write-Host ""
Write-Host "=== 完成 ===" -ForegroundColor Green
Write-Host ("镜像:       {0}" -f $imgOut)
Write-Host ("大小:       {0} bytes ({1:N1} MB)" -f $imgItem.Length, ($imgItem.Length / 1MB))
Write-Host ("MBR 签名:   {0}  (应为 55AA)" -f $mbrSig)
Write-Host ("镜像 SHA256:{0}" -f $imgHash)
Write-Host ("清单:       {0}" -f $manifest)
Write-Host ""
Write-Host "请把上面这几行发回来，或者直接说一声『跑完了』。" -ForegroundColor Cyan
