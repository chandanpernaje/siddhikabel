Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('public\images\slider1.jpg')
Write-Output "slider1.jpg: $($img.Width)x$($img.Height)"
$img.Dispose()

$img = [System.Drawing.Image]::FromFile('public\images\slider2.jpg')
Write-Output "slider2.jpg: $($img.Width)x$($img.Height)"
$img.Dispose()

$img = [System.Drawing.Image]::FromFile('public\images\slider3.jpg')
Write-Output "slider3.jpg: $($img.Width)x$($img.Height)"
$img.Dispose()
