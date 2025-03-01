$startupFolder = [Environment]::GetFolderPath("Startup")

Remove-Item "$startupFolder\security.exe" -ErrorAction SilentlyContinue