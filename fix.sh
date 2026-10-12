#!/usr/bin/env bash
set -e

sudo tee /etc/udev/hwdb.d/90-nopgupdn.hwdb >/dev/null <<'EOF'
evdev:input:*
 KEYBOARD_KEY_7004b=reserved
 KEYBOARD_KEY_7004e=reserved
 KEYBOARD_KEY_c9=reserved
 KEYBOARD_KEY_d1=reserved
EOF

sudo systemd-hwdb update
sudo udevadm trigger
echo "PageUp and PageDown are now disabled."
