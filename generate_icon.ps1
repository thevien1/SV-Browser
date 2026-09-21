param(
    [string]$ExePath,
    [string]$NumberText,
    [string]$IcoPath,
    [string]$PngPath
)

Add-Type -AssemblyName System.Drawing

$size = 64
$bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$extractedIcon = [System.Drawing.Icon]::ExtractAssociatedIcon($ExePath)
$chromeBmp = $extractedIcon.ToBitmap()

$chromeHeight = [int]($size * 0.78)
$chromeWidth = [int]($size * 0.78)
$chromeX = [int](($size - $chromeWidth) / 2)
$chromeY = 0
$g.DrawImage($chromeBmp, $chromeX, $chromeY, $chromeWidth, $chromeHeight)

$badgeHeight = [int]($size * 0.38)
$badgeWidth = [int]($size * 0.82)
$badgeX = [int](($size - $badgeWidth) / 2)
$badgeY = [int]($size - $badgeHeight - 1)
$radius = [int]($badgeHeight / 2)

$badgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 11, 106, 42))

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$diameter = $radius * 2
$rect = New-Object System.Drawing.Rectangle($badgeX, $badgeY, $badgeWidth, $badgeHeight)

$path.AddArc($rect.X, $rect.Y, $diameter, $diameter, 90, 180)
$path.AddArc($rect.Right - $diameter, $rect.Y, $diameter, $diameter, 270, 180)
$path.CloseFigure()

$g.FillPath($badgeBrush, $path)

$fontSize = if ($NumberText.Length -ge 3) { [int]($badgeHeight * 0.58) } else { [int]($badgeHeight * 0.70) }
$font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

$textRect = New-Object System.Drawing.RectangleF($badgeX, $badgeY, $badgeWidth, $badgeHeight)
$g.DrawString($NumberText, $font, $textBrush, $textRect, $sf)

$bmp.Save($PngPath, [System.Drawing.Imaging.ImageFormat]::Png)

$hIcon = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = New-Object System.IO.FileStream($IcoPath, [System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()

$g.Dispose()
$bmp.Dispose()
$chromeBmp.Dispose()
$extractedIcon.Dispose()
Write-Output "OK"
