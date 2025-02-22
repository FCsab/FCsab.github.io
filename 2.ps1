$startupFolder = [Environment]::GetFolderPath("Startup")

Remove-Item "$startupFolder\edge.exe" -ErrorAction SilentlyContinue