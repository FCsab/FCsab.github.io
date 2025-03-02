$startupFolder = [Environment]::GetFolderPath("Startup")
Start-Sleep -Seconds 1

Remove-Item "$startupFolder\security.exe" -ErrorAction SilentlyContinue
