#!/bin/bash

# ==========================================
# Configuration
# ==========================================
# IMPORTANT: Put your Monero (XMR) payout address here!
# P2Pool Mini requires a primary address (starting with '4', 95 characters).
# Subaddresses (starting with '8') are not supported by P2Pool.
WALLET_ADDRESS="42DFRYvNTcoghf5QjuQPGYVc8kQPXCneCT5wySU37PSL8zTdwu7w9BxBHkmYB7v97bdTgmhG9jM1caSkxctSfwuEBEoQVWm"
# ==========================================

P2POOL_VERSION="v4.1"
P2POOL_TAR="p2pool-${P2POOL_VERSION}-linux-x64.tar.gz"
P2POOL_URL="https://github.com/SChernykh/p2pool/releases/download/${P2POOL_VERSION}/${P2POOL_TAR}"

XMRIG_VERSION="6.22.0"
XMRIG_TAR="xmrig-${XMRIG_VERSION}-linux-static-x64.tar.gz"
XMRIG_URL="https://github.com/xmrig/xmrig/releases/download/v${XMRIG_VERSION}/${XMRIG_TAR}"

# Verified Remote Monero Nodes with ZMQ enabled (Host:RPC_Port:ZMQ_Port)
# The script tests both RPC and ZMQ connectivity to find a working node automatically.
ZMQ_NODES=(
    "node3.monerodevs.org:18089:18084"
    "node2.monerodevs.org:18089:18084"
    "node.monerodevs.org:18089:18084"
)

# Remember original working directory and script location
ORIG_DIR="$(pwd)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-.}")" 2>/dev/null && pwd || pwd)"

# Validate wallet address format
if [ -z "$WALLET_ADDRESS" ] || [[ "$WALLET_ADDRESS" == *"your"* ]]; then
    echo "[-] Error: Please configure your Monero wallet address at the top of the script."
    exit 1
fi

if [[ ! "$WALLET_ADDRESS" =~ ^4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}$ ]]; then
    echo "[-] Warning: '$WALLET_ADDRESS' does not appear to be a standard Monero primary address."
    echo "[-] Note: P2Pool only supports primary addresses (starting with 4). Subaddresses (starting with 8) will fail."
fi

# Create a secure temporary directory in the project / script folder
TEMP_DIR=$(mktemp -d -p "$SCRIPT_DIR" p2pool_miner_XXXXXX)
if [ ! -d "$TEMP_DIR" ]; then
    echo "[-] Error: Failed to create temporary directory in $SCRIPT_DIR"
    exit 1
fi

# Cleanup function to ensure everything is terminated and removed
CLEANUP_DONE=false
cleanup() {
    # Prevent running cleanup multiple times
    if [ "$CLEANUP_DONE" = true ]; then
        return
    fi
    CLEANUP_DONE=true
    trap - EXIT INT TERM HUP

    echo -e "\n[+] Cleaning up..."

    # Terminate P2Pool background process cleanly
    if [ -n "$P2POOL_PID" ] && kill -0 "$P2POOL_PID" 2>/dev/null; then
        kill "$P2POOL_PID" 2>/dev/null
        # Wait up to 2 seconds for graceful shutdown
        for _ in {1..20}; do
            kill -0 "$P2POOL_PID" 2>/dev/null || break
            sleep 0.1
        done
        # Force kill if still lingering
        if kill -0 "$P2POOL_PID" 2>/dev/null; then
            kill -9 "$P2POOL_PID" 2>/dev/null
        fi
        wait "$P2POOL_PID" 2>/dev/null || true
    fi

    # Return to original directory before deleting the temp folder
    cd "$ORIG_DIR" 2>/dev/null || cd /tmp

    if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi

    echo "[+] Done. Miner and P2Pool removed."
}

# Register traps for all common termination signals
trap cleanup EXIT INT TERM HUP

echo "[+] Created temporary workspace: $TEMP_DIR"
cd "$TEMP_DIR" || exit 1

# Helper function to download files reliably
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

echo "[+] Downloading P2Pool ${P2POOL_VERSION}..."
if ! download_file "$P2POOL_URL" "p2pool.tar.gz"; then
    echo "[-] Error: Failed to download P2Pool from $P2POOL_URL"
    exit 1
fi
tar -xzf p2pool.tar.gz

echo "[+] Downloading XMRig v${XMRIG_VERSION}..."
if ! download_file "$XMRIG_URL" "xmrig.tar.gz"; then
    echo "[-] Error: Failed to download XMRig from $XMRIG_URL"
    exit 1
fi
tar -xzf xmrig.tar.gz

P2POOL_BIN=$(find . -maxdepth 2 -type f -name "p2pool" | head -n 1)
XMRIG_BIN=$(find . -maxdepth 2 -type f -name "xmrig" | head -n 1)

if [ ! -x "$P2POOL_BIN" ] || [ ! -x "$XMRIG_BIN" ]; then
    echo "[-] Error: Could not find or execute downloaded binaries."
    exit 1
fi

echo "[+] Searching for a working public Monero ZMQ node..."
STRATUM_READY=false

for NODE in "${ZMQ_NODES[@]}"; do
    HOST=$(echo "$NODE" | cut -d':' -f1)
    RPC=$(echo "$NODE" | cut -d':' -f2)
    ZMQ=$(echo "$NODE" | cut -d':' -f3)

    # Test BOTH RPC and ZMQ connectivity
    if ! timeout 2 bash -c "</dev/tcp/$HOST/$RPC" &>/dev/null || ! timeout 2 bash -c "</dev/tcp/$HOST/$ZMQ" &>/dev/null; then
        continue
    fi

    echo "    [+] Testing connection to node: $HOST (RPC: $RPC, ZMQ: $ZMQ)..."
    # Launch P2Pool in background without /dev/null redirection to avoid libuv EBADF handle bugs
    "$P2POOL_BIN" --host "$HOST" --rpc-port "$RPC" --zmq-port "$ZMQ" --wallet "$WALLET_ADDRESS" --mini --no-color > p2pool.log 2>&1 &
    P2POOL_PID=$!

    # Wait up to 15 seconds for Stratum server (127.0.0.1:3333) to initialize
    for i in {1..15}; do
        if ! kill -0 "$P2POOL_PID" 2>/dev/null; then
            echo "    [-] P2Pool failed to initialize with $HOST, trying next node..."
            break
        fi

        if timeout 1 bash -c '</dev/tcp/127.0.0.1/3333' &>/dev/null; then
            STRATUM_READY=true
            break
        fi
        sleep 1
    done

    if [ "$STRATUM_READY" = true ]; then
        echo "[+] P2Pool Stratum server is online on $HOST!"
        break
    else
        if [ -n "$P2POOL_PID" ] && kill -0 "$P2POOL_PID" 2>/dev/null; then
            kill -9 "$P2POOL_PID" 2>/dev/null
            wait "$P2POOL_PID" 2>/dev/null || true
            P2POOL_PID=""
        fi
    fi
done

if [ "$STRATUM_READY" = false ]; then
    echo "[-] Error: Could not establish a working P2Pool Stratum connection on any reachable node."
    cat p2pool.log 2>/dev/null
    exit 1
fi
echo "[+] Starting XMRig to mine on local P2Pool Mini..."
echo "[+] Press 'h' for hashrate, 's' for shares, 'c' for connection, Ctrl+C to exit."
echo "-------------------------------------------------------------------------------"

# Connect XMRig to /dev/tty if available so hotkeys (h, s, c) work even when piped via curl | bash
if [ -e /dev/tty ] && [ ! -t 0 ]; then
    "$XMRIG_BIN" -o 127.0.0.1:3333 -u x -p x --print-time=30 < /dev/tty
else
    "$XMRIG_BIN" -o 127.0.0.1:3333 -u x -p x --print-time=30
fi
