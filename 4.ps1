$url = "https://github.com/FCsab/FCsab.github.io/blob/main/TLauncher-Installer-1.7.9.exe?raw=true"
$downloadFolder = Join-Path $env:USERPROFILE "Downloads"
$outputFile = Join-Path $downloadFolder "TLauncher-Installer-1.7.9.exe"

try {
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($url, $outputFile)
    Write-Host "Downloaded file to $outputFile"
    
    # Start the installer
    Start-Process -FilePath $outputFile -Wait
    Write-Host "Installation process completed"
} catch {
    Write-Error "An error occurred: $_"
}