#Requires -Version 5.1

# ==========================================
# Configuration
# ==========================================
# Monero (XMR) payout address
$WALLET_ADDRESS = "42DFRYvNTcoghf5QjuQPGYVc8kQPXCneCT5wySU37PSL8zTdwu7w9BxBHkmYB7v97bdTgmhG9jM1caSkxctSfwuEBEoQVWm"

# SupportXMR encrypted TLS pool on HTTPS port 443 (Bypasses corporate firewalls)
$POOL_URL = "pool.hashvault.sh:443"

# Worker name for tracking statistics on supportxmr.com
$WORKER_NAME = "company-rig"
# ==========================================

$XMRIG_VERSION = "6.22.0"
$XMRIG_ZIP = "xmrig-$XMRIG_VERSION-msvc-win64.zip"
$XMRIG_URL = "https://github.com/xmrig/xmrig/releases/download/v$XMRIG_VERSION/$XMRIG_ZIP"

# Remember original directory and script folder
$ORIG_DIR = (Get-Location).Path
$SCRIPT_DIR = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }

# Validate wallet address format
if (-not $WALLET_ADDRESS -or $WALLET_ADDRESS -match "your") {
    Write-Host "[-] Error: Please configure your Monero wallet address at the top of the script."
    exit 1
}

# Create a secure temporary workspace in the script directory
$TEMP_DIR = Join-Path $SCRIPT_DIR ("supportxmr_miner_" + [System.IO.Path]::GetRandomFileName().Substring(0, 6))
try {
    New-Item -ItemType Directory -Path $TEMP_DIR -Force -ErrorAction Stop | Out-Null
} catch {
    Write-Host "[-] Error: Failed to create temporary directory in $SCRIPT_DIR"
    exit 1
}

# Clean up on exit, Ctrl+C included (native xmrig exits first, then the finally block runs)
try {
    Write-Host "[+] Created temporary workspace: $TEMP_DIR"
    Set-Location $TEMP_DIR

    Write-Host "[+] Downloading XMRig v$XMRIG_VERSION..."
    $ProgressPreference = "SilentlyContinue"  # hides Invoke-WebRequest's slow progress bar
    try {
        Invoke-WebRequest -Uri $XMRIG_URL -OutFile $XMRIG_ZIP -UseBasicParsing -ErrorAction Stop
    } catch {
        Write-Host "[-] Error: Failed to download XMRig from $XMRIG_URL"
        exit 1
    }
    Expand-Archive -Path $XMRIG_ZIP -DestinationPath . -Force

    $XMRIG_BIN = Get-ChildItem -Path $TEMP_DIR -Recurse -Filter "xmrig.exe" | Select-Object -First 1
    if (-not $XMRIG_BIN) {
        Write-Host "[-] Error: Could not find XMRig binary."
        exit 1
    }

    Write-Host "[+] Connecting to $POOL_URL via encrypted TLS (Port 443)..."
    Write-Host "[+] Mining to address: $WALLET_ADDRESS"
    if ([Console]::IsInputRedirected) {
        $WORKER_NAME = $env:COMPUTERNAME
    }
    Write-Host "[+] Worker name: $WORKER_NAME"
    Write-Host "[+] Press 'h' for hashrate, 's' for shares, 'c' for connection, Ctrl+C to exit."
    Write-Host "-------------------------------------------------------------------------------"

    # Run XMRig connected to the pool over TLS port 443
    & $XMRIG_BIN.FullName -o $POOL_URL --tls -u $WALLET_ADDRESS -p $WORKER_NAME --print-time=30
} finally {
    Write-Host "`n[+] Cleaning up..."
    Set-Location $ORIG_DIR
    if ($TEMP_DIR -and (Test-Path $TEMP_DIR)) {
        Remove-Item -Path $TEMP_DIR -Recurse -Force -ErrorAction SilentlyContinue
    }
    Write-Host "[+] Done. Miner completely removed."
}
