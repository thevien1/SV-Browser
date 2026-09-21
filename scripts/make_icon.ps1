Add-Type -AssemblyName System.Drawing

$rootDir = Split-Path -Parent $PSScriptRoot
$srcJpg = 'C:\Users\pc\.gemini\antigravity\brain\b67fd359-b096-432b-807c-add19009a7fb\sv_browser_icon_1789954689107.jpg'
$assetsDir = Join-Path $rootDir "assets"
$destIco = Join-Path $assetsDir "icon.ico"
$destPng = Join-Path $assetsDir "icon.png"

if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null
}

$img = [System.Drawing.Image]::FromFile($srcJpg)

# Save master 256x256 PNG
$masterBmp = New-Object System.Drawing.Bitmap(256, 256, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($masterBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($img, 0, 0, 256, 256)
$g.Dispose()

if (Test-Path $destPng) { Remove-Item $destPng -Force }
$masterBmp.Save($destPng, [System.Drawing.Imaging.ImageFormat]::Png)

# Generate multi-res buffers: 256, 128, 64, 48, 32, 16
$sizes = @(256, 128, 64, 48, 32, 16)
$pngBuffers = New-Object System.Collections.ArrayList

foreach ($sz in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g2 = [System.Drawing.Graphics]::FromImage($bmp)
    $g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g2.DrawImage($img, 0, 0, $sz, $sz)
    $g2.Dispose()

    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $arr = $ms.ToArray()
    $pngBuffers.Add(@{ Size = $sz; Bytes = $arr }) | Out-Null
    $ms.Dispose()
    $bmp.Dispose()
}

$masterBmp.Dispose()
$img.Dispose()

if (Test-Path $destIco) { Remove-Item $destIco -Force }

# Build standard Windows ICO format with PNG streams
$fs = New-Object System.IO.FileStream($destIco, [System.IO.FileMode]::Create)
$bw = New-Object System.IO.BinaryWriter($fs)

# ICONHEADER
$bw.Write([uint16]0)
$bw.Write([uint16]1)
$bw.Write([uint16]$pngBuffers.Count)

$offset = 6 + ($pngBuffers.Count * 16)

foreach ($item in $pngBuffers) {
    $sz = $item.Size
    $bytes = $item.Bytes
    
    $w = if ($sz -eq 256) { 0 } else { $sz }
    $h = if ($sz -eq 256) { 0 } else { $sz }
    
    $bw.Write([byte]$w)
    $bw.Write([byte]$h)
    $bw.Write([byte]0)   # Color count
    $bw.Write([byte]0)   # Reserved
    $bw.Write([uint16]1) # Planes
    $bw.Write([uint16]32)# BitCount
    $bw.Write([uint32]$bytes.Length) # BytesInRes
    $bw.Write([uint32]$offset)       # ImageOffset
    
    $offset += $bytes.Length
}

foreach ($item in $pngBuffers) {
    $bytes = $item.Bytes
    $bw.Write($bytes)
}

$bw.Close()
$fs.Close()

Write-Host "Tạo thành công icon.ico! Kích thước:" (Get-Item $destIco).Length "bytes"
Write-Host "Tạo thành công icon.png! Kích thước:" (Get-Item $destPng).Length "bytes"
