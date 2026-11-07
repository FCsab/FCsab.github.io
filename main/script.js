// ===== csabi.zip — Windows XP desktop =====

const apps = [
    { id: 'instagram', name: 'instagram', desc: '@csabi.zip', img: 'img/instagram.png', url: 'https://www.instagram.com/csabi.zip' },
    { id: 'spotify', name: 'spotify', desc: 'What I listen to', img: 'img/spotify.png', url: 'https://open.spotify.com/user/31khlgxohmflp7tkwtbr4shpaidm?si=7t5uLS6jTNGfVs3LbS8Qfg' },
    { id: 'steam', name: 'steam', desc: 'csabidotzip', img: 'img/steam.png', url: 'https://steamcommunity.com/id/csabidotzip/' },
    { id: 'github', name: 'github', desc: 'FCsab', img: 'img/github.png', url: 'https://github.com/FCsab' },
    // internal pages open in an XP window instead of a new tab
    { id: 'japanese', name: 'japanese', desc: 'Kana practice', img: 'img/japan.png', url: 'japan.html', internal: true, title: 'Japanese Kana Practice' }
];

function openApp(app) {
    if (app.internal) {
        openWindow({ id: app.id, title: app.title || app.name, icon: app.img, url: app.url });
    } else {
        window.open(app.url, '_blank', 'noopener');
    }
}

// ---------------------------------------------------------------
// Desktop icons
// ---------------------------------------------------------------

const desktop = document.getElementById('desktop');
const iconContainer = document.getElementById('icon-container');

const CELL_W = 84;
const CELL_H = 88;
const ORIGIN = 8;

function gridSize() {
    return {
        cols: Math.max(1, Math.floor((desktop.clientWidth - ORIGIN) / CELL_W)),
        rows: Math.max(1, Math.floor((desktop.clientHeight - ORIGIN) / CELL_H))
    };
}

// XP fills icons top-to-bottom, then left-to-right
function arrangeIcons() {
    const { rows } = gridSize();
    apps.forEach((app, i) => {
        app.col = Math.floor(i / rows);
        app.row = i % rows;
    });
    positionIcons();
}

function positionIcons() {
    apps.forEach(app => {
        app.el.style.left = `${ORIGIN + app.col * CELL_W}px`;
        app.el.style.top = `${ORIGIN + app.row * CELL_H}px`;
    });
}

function selectedApps() {
    return apps.filter(a => a.el.classList.contains('selected'));
}

function clearSelection() {
    apps.forEach(a => a.el.classList.remove('selected'));
}

function createIcons() {
    apps.forEach(app => {
        const el = document.createElement('div');
        el.className = 'desktop-icon';
        el.tabIndex = 0;

        const wrap = document.createElement('div');
        wrap.className = 'icon-img-wrap';
        const img = document.createElement('img');
        img.src = app.img;
        img.alt = '';
        const tint = document.createElement('div');
        tint.className = 'icon-tint';
        tint.style.webkitMaskImage = `url("${app.img}")`;
        tint.style.maskImage = `url("${app.img}")`;
        wrap.append(img, tint);

        const label = document.createElement('div');
        label.className = 'icon-label';
        label.textContent = app.name;

        el.append(wrap, label);
        app.el = el;
        attachIconHandlers(app);
        iconContainer.appendChild(el);
    });
}

function attachIconHandlers(app) {
    const el = app.el;
    let drag = null;

    el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        hideContextMenu();

        if (e.ctrlKey) {
            el.classList.toggle('selected');
        } else if (!el.classList.contains('selected')) {
            clearSelection();
            el.classList.add('selected');
        }

        el.setPointerCapture(e.pointerId);
        drag = {
            x: e.clientX,
            y: e.clientY,
            moved: false,
            touch: e.pointerType !== 'mouse',
            items: selectedApps().map(a => ({ app: a, left: a.el.offsetLeft, top: a.el.offsetTop }))
        };
    });

    el.addEventListener('pointermove', (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) > 5) {
            drag.moved = true;
            drag.items.forEach(({ app }) => app.el.classList.add('dragging'));
        }
        if (drag.moved) {
            drag.items.forEach(({ app, left, top }) => {
                app.el.style.left = `${left + dx}px`;
                app.el.style.top = `${top + dy}px`;
            });
        }
    });

    el.addEventListener('pointerup', () => {
        if (!drag) return;
        const d = drag;
        drag = null;
        if (d.moved) {
            d.items.forEach(({ app }) => app.el.classList.remove('dragging'));
            snapIcons(d.items.map(i => i.app));
        } else if (d.touch) {
            // no double-click on touch screens: a tap opens
            openApp(app);
        }
    });

    el.addEventListener('pointercancel', () => {
        if (!drag) return;
        drag.items.forEach(({ app }) => app.el.classList.remove('dragging'));
        drag = null;
        positionIcons();
    });

    el.addEventListener('dblclick', () => openApp(app));

    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') selectedApps().forEach(openApp);
    });

    el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showContextMenu(e.clientX, e.clientY, [
            { label: 'Open', bold: true, action: () => openApp(app) },
            { sep: true },
            { label: 'Properties', action: () => openProperties(app) }
        ]);
    });
}

// Snap dragged icons onto the grid; if any lands on an occupied cell, undo the move.
function snapIcons(moved) {
    const { cols, rows } = gridSize();
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const targets = moved.map(app => ({
        app,
        col: clamp(Math.round((app.el.offsetLeft - ORIGIN) / CELL_W), 0, cols - 1),
        row: clamp(Math.round((app.el.offsetTop - ORIGIN) / CELL_H), 0, rows - 1)
    }));

    const occupied = new Set(apps.filter(a => !moved.includes(a)).map(a => `${a.col},${a.row}`));
    const ok = targets.every(t => {
        const key = `${t.col},${t.row}`;
        if (occupied.has(key)) return false;
        occupied.add(key);
        return true;
    });

    if (ok) targets.forEach(t => { t.app.col = t.col; t.app.row = t.row; });
    positionIcons();
}

// Keep icons on screen when the window shrinks
function fitIconsToScreen() {
    const { cols, rows } = gridSize();
    if (apps.some(a => a.col >= cols || a.row >= rows)) arrangeIcons();
    else positionIcons();
}

// ---------------------------------------------------------------
// Rubber-band selection on the desktop
// ---------------------------------------------------------------

let band = null;

desktop.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    hideContextMenu();
    clearSelection();
    desktop.setPointerCapture(e.pointerId);
    const rect = document.createElement('div');
    rect.id = 'selection-rect';
    document.body.appendChild(rect);
    band = { x: e.clientX, y: e.clientY, rect };
    updateBand(e.clientX, e.clientY);
});

desktop.addEventListener('pointermove', (e) => {
    if (band) updateBand(e.clientX, e.clientY);
});

function endBand() {
    if (!band) return;
    band.rect.remove();
    band = null;
}
desktop.addEventListener('pointerup', endBand);
desktop.addEventListener('pointercancel', endBand);

function updateBand(cx, cy) {
    const left = Math.min(band.x, cx);
    const top = Math.min(band.y, cy);
    const right = Math.max(band.x, cx);
    const bottom = Math.max(band.y, cy);
    Object.assign(band.rect.style, {
        left: `${left}px`, top: `${top}px`,
        width: `${right - left}px`, height: `${bottom - top}px`
    });
    apps.forEach(app => {
        const r = app.el.getBoundingClientRect();
        const hit = left < r.right && right > r.left && top < r.bottom && bottom > r.top;
        app.el.classList.toggle('selected', hit);
    });
}

// ---------------------------------------------------------------
// Context menu
// ---------------------------------------------------------------

const contextMenu = document.getElementById('context-menu');

function showContextMenu(x, y, items) {
    contextMenu.replaceChildren();
    items.forEach(item => {
        if (item.sep) {
            const sep = document.createElement('div');
            sep.className = 'xp-menu-sep';
            contextMenu.appendChild(sep);
            return;
        }
        const el = document.createElement('div');
        el.className = 'xp-menu-item';
        el.textContent = item.label;
        if (item.bold) el.style.fontWeight = 'bold';
        el.addEventListener('click', () => {
            hideContextMenu();
            item.action();
        });
        contextMenu.appendChild(el);
    });
    contextMenu.hidden = false;
    const w = contextMenu.offsetWidth;
    const h = contextMenu.offsetHeight;
    contextMenu.style.left = `${Math.min(x, window.innerWidth - w - 2)}px`;
    contextMenu.style.top = `${Math.min(y, window.innerHeight - h - 32)}px`;
}

function hideContextMenu() {
    contextMenu.hidden = true;
}

desktop.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, [
        { label: 'Arrange Icons', action: arrangeIcons },
        { label: 'Refresh', action: refreshDesktop },
        { sep: true },
        { label: 'Properties', action: openAbout }
    ]);
});

document.addEventListener('pointerdown', (e) => {
    if (!contextMenu.contains(e.target)) hideContextMenu();
});

function refreshDesktop() {
    iconContainer.style.visibility = 'hidden';
    setTimeout(() => { iconContainer.style.visibility = ''; }, 120);
}

// ---------------------------------------------------------------
// Windows
// ---------------------------------------------------------------

const windowLayer = document.getElementById('window-layer');
const openWindows = new Map();
let zTop = 10;
let cascade = 0;

function openWindow({ id, title, icon, url, content, width = 820, height = 560, resizable = true, maximizeOnSmall = resizable, onClose }) {
    if (openWindows.has(id)) {
        focusWindow(id);
        return openWindows.get(id);
    }

    const win = document.createElement('div');
    win.className = 'xp-window';

    const bar = document.createElement('div');
    bar.className = 'xp-titlebar';
    if (icon) {
        const img = document.createElement('img');
        img.src = icon;
        img.alt = '';
        bar.appendChild(img);
    }
    const titleEl = document.createElement('span');
    titleEl.className = 'xp-title';
    titleEl.textContent = title;
    bar.appendChild(titleEl);

    const mkBtn = (cls, label, fn) => {
        const b = document.createElement('button');
        b.className = `xp-ctrl ${cls}`;
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('pointerdown', e => e.stopPropagation());
        b.addEventListener('click', fn);
        bar.appendChild(b);
    };
    mkBtn('min', 'Minimize', () => minimizeWindow(id));
    if (resizable) mkBtn('max', 'Maximize', () => toggleMaximize(id));
    mkBtn('close', 'Close', () => closeWindow(id));

    const body = document.createElement('div');
    body.className = 'xp-body';
    if (url) {
        const frame = document.createElement('iframe');
        frame.src = url;
        frame.title = title;
        body.appendChild(frame);
    } else if (content) {
        body.appendChild(content);
    }

    win.append(bar, body);

    // initial size/position (cascade like XP)
    const layerW = windowLayer.clientWidth;
    const layerH = windowLayer.clientHeight;
    const w = Math.min(width, layerW - 20);
    const h = Math.min(height, layerH - 20);
    const offset = (cascade++ % 6) * 26;
    win.style.width = `${w}px`;
    win.style.height = `${h}px`;
    win.style.left = `${Math.max(0, (layerW - w) / 2 - 80 + offset)}px`;
    win.style.top = `${Math.max(0, (layerH - h) / 2 - 60 + offset)}px`;
    // phones (portrait or landscape): open full-screen
    if (maximizeOnSmall && isSmallScreen()) win.classList.add('maximized');

    if (resizable) {
        const grip = document.createElement('div');
        grip.className = 'xp-resize';
        win.appendChild(grip);
        makeResizable(win, grip);
    }

    makeDraggable(win, bar);
    if (resizable) bar.addEventListener('dblclick', () => toggleMaximize(id));
    win.addEventListener('pointerdown', () => focusWindow(id), true);

    windowLayer.appendChild(win);

    const task = Taskbar.addTask(id, title, icon, () => {
        if (win.classList.contains('minimized') || !isFocused(id)) focusWindow(id);
        else minimizeWindow(id);
    });

    const entry = { win, task, onClose };
    openWindows.set(id, entry);
    focusWindow(id);
    return entry;
}

function isSmallScreen() {
    return window.innerWidth < 600 || window.innerHeight < 500;
}

const isTouch = window.matchMedia('(pointer: coarse)').matches;

function isFocused(id) {
    const entry = openWindows.get(id);
    return entry && !entry.win.classList.contains('inactive');
}

function focusWindow(id) {
    const entry = openWindows.get(id);
    if (!entry) return;
    entry.win.classList.remove('minimized');
    entry.win.style.zIndex = ++zTop;
    openWindows.forEach((e, key) => e.win.classList.toggle('inactive', key !== id));
    Taskbar.setActiveTask(id);
}

function minimizeWindow(id) {
    const entry = openWindows.get(id);
    if (!entry) return;
    entry.win.classList.add('minimized', 'inactive');
    Taskbar.setActiveTask(null);
    // focus the next visible window, like XP does
    const next = [...openWindows.entries()]
        .filter(([, e]) => !e.win.classList.contains('minimized'))
        .sort((a, b) => b[1].win.style.zIndex - a[1].win.style.zIndex)[0];
    if (next) focusWindow(next[0]);
}

function toggleMaximize(id) {
    const entry = openWindows.get(id);
    if (entry) entry.win.classList.toggle('maximized');
}

function closeWindow(id) {
    const entry = openWindows.get(id);
    if (!entry) return;
    entry.win.remove();
    Taskbar.removeTask(id);
    openWindows.delete(id);
    if (entry.onClose) entry.onClose();
}

// Clicking inside an iframe doesn't bubble to us; detect it via window blur.
window.addEventListener('blur', () => {
    setTimeout(() => {
        const active = document.activeElement;
        if (active && active.tagName === 'IFRAME') {
            for (const [id, e] of openWindows) {
                if (e.win.contains(active)) { focusWindow(id); break; }
            }
        }
    }, 0);
});

function makeDraggable(win, handle) {
    let start = null;
    handle.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || win.classList.contains('maximized')) return;
        handle.setPointerCapture(e.pointerId);
        start = { x: e.clientX, y: e.clientY, left: win.offsetLeft, top: win.offsetTop };
        document.body.classList.add('dragging-window');
    });
    handle.addEventListener('pointermove', (e) => {
        if (!start) return;
        const maxTop = windowLayer.clientHeight - 29;
        win.style.left = `${start.left + e.clientX - start.x}px`;
        win.style.top = `${Math.max(0, Math.min(maxTop, start.top + e.clientY - start.y))}px`;
    });
    const end = () => {
        start = null;
        document.body.classList.remove('dragging-window');
    };
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
}

function makeResizable(win, grip) {
    let start = null;
    grip.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        grip.setPointerCapture(e.pointerId);
        start = { x: e.clientX, y: e.clientY, w: win.offsetWidth, h: win.offsetHeight };
        document.body.classList.add('dragging-window');
    });
    grip.addEventListener('pointermove', (e) => {
        if (!start) return;
        win.style.width = `${Math.max(260, start.w + e.clientX - start.x)}px`;
        win.style.height = `${Math.max(140, start.h + e.clientY - start.y)}px`;
    });
    const end = () => {
        start = null;
        document.body.classList.remove('dragging-window');
    };
    grip.addEventListener('pointerup', end);
    grip.addEventListener('pointercancel', end);
}

// ---------------------------------------------------------------
// Dialogs
// ---------------------------------------------------------------

function dialog(html, buttons = []) {
    const box = document.createElement('div');
    box.className = 'xp-dialog';
    box.innerHTML = html;
    if (buttons.length) {
        const row = document.createElement('div');
        row.className = 'xp-dialog-buttons';
        buttons.forEach(({ label, action }) => {
            const b = document.createElement('button');
            b.className = 'xp-btn';
            b.textContent = label;
            b.addEventListener('click', action);
            row.appendChild(b);
        });
        box.appendChild(row);
    }
    return box;
}

function openAbout() {
    openWindow({
        id: 'about',
        title: 'System Properties',
        icon: 'img/windows-xp.jpg',
        width: 360,
        height: 240,
        resizable: false,
        content: dialog(`
            <h2>csabi.zip</h2>
            <p>Microsoft Windows XP<br>Media Center Edition<br>Version 2005, Service Pack 2</p>
            <p>Registered to:<br>&nbsp;&nbsp;csabi<br>&nbsp;&nbsp;<a href="https://github.com/FCsab" target="_blank" rel="noopener">github.com/FCsab</a></p>
        `, [{ label: 'OK', action: () => closeWindow('about') }])
    });
}

function openProperties(app) {
    const id = `props-${app.id}`;
    const host = (() => {
        try { return new URL(app.url, location.href).host; } catch { return app.url; }
    })();
    openWindow({
        id,
        title: `${app.name} Properties`,
        icon: app.img,
        width: 340,
        height: 220,
        resizable: false,
        content: dialog(`
            <h2>${app.name}</h2>
            <p>Type: Internet Shortcut<br>Description: ${app.desc}<br>Target: ${host}</p>
        `, [
            { label: 'Open', action: () => { closeWindow(id); openApp(app); } },
            { label: 'Cancel', action: () => closeWindow(id) }
        ])
    });
}

// ---------------------------------------------------------------
// Start menu
// ---------------------------------------------------------------

function buildStartMenu() {
    const left = document.getElementById('sm-left');
    const right = document.getElementById('sm-right');

    const item = (img, title, desc, action) => {
        const li = document.createElement('li');
        li.className = 'sm-item';
        li.tabIndex = 0;
        const icon = document.createElement('img');
        icon.src = img;
        icon.alt = '';
        const text = document.createElement('div');
        text.className = 'sm-item-text';
        const b = document.createElement('b');
        b.textContent = title;
        text.appendChild(b);
        if (desc) {
            const s = document.createElement('small');
            s.textContent = desc;
            text.appendChild(s);
        }
        li.append(icon, text);
        const run = () => { Taskbar.setStartMenu(false); action(); };
        li.addEventListener('click', run);
        li.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
        return li;
    };
    const sep = () => {
        const li = document.createElement('li');
        li.className = 'sm-sep';
        return li;
    };

    apps.forEach(app => left.appendChild(item(app.img, app.name, app.desc, () => openApp(app))));

    right.appendChild(item('img/github.png', 'Source Code', null,
        () => window.open('https://github.com/FCsab/FCsab.github.io', '_blank', 'noopener')));
    right.appendChild(item('img/japan.png', 'Japanese Practice', null,
        () => openApp(apps.find(a => a.id === 'japanese'))));
    right.appendChild(sep());
    right.appendChild(item('img/windows-xp.jpg', 'System Properties', null, openAbout));

    // header avatar: GitHub profile picture, falls back to the wallpaper
    const avatar = document.querySelector('.sm-avatar');
    avatar.addEventListener('error', () => { avatar.src = 'img/windows-xp.jpg'; }, { once: true });
    avatar.src = 'https://github.com/FCsab.png?size=96';

    document.querySelector('[data-action="logoff"]').addEventListener('click', () => location.reload());
    document.querySelector('[data-action="shutdown"]').addEventListener('click', () => {
        Taskbar.setStartMenu(false);
        showShutdown();
    });
}

// ---------------------------------------------------------------
// Turn Off Computer
// ---------------------------------------------------------------

function showShutdown() {
    const overlay = document.createElement('div');
    overlay.className = 'shutdown-overlay';
    overlay.innerHTML = `
        <div class="shutdown-box">
            <div class="shutdown-top"><span>Turn off computer</span></div>
            <div class="shutdown-mid">
                <button class="shutdown-opt" data-opt="standby"><span class="opt-standby">&#x263E;</span>Stand By</button>
                <button class="shutdown-opt" data-opt="off"><span class="opt-off">&#x23FB;</span>Turn Off</button>
                <button class="shutdown-opt" data-opt="restart"><span class="opt-restart">&#x21BB;</span>Restart</button>
            </div>
            <div class="shutdown-bottom"><button class="xp-btn" data-opt="cancel">Cancel</button></div>
        </div>`;

    const blackScreen = (text) => {
        overlay.remove();
        const screen = document.createElement('div');
        screen.className = 'black-screen';
        screen.innerHTML = text;
        screen.addEventListener('click', () => screen.remove());
        document.body.appendChild(screen);
    };

    overlay.addEventListener('click', (e) => {
        const opt = e.target.closest('[data-opt]')?.dataset.opt;
        if (e.target === overlay || opt === 'cancel') overlay.remove();
        else if (opt === 'standby') blackScreen('');
        else if (opt === 'off') blackScreen('It is now safe to turn off<br>your computer.');
        else if (opt === 'restart') location.reload();
    });
    document.body.appendChild(overlay);
}

// ---------------------------------------------------------------
// Boot
// ---------------------------------------------------------------

createIcons();
arrangeIcons();
buildStartMenu();
window.addEventListener('resize', fitIconsToScreen);

setTimeout(() => {
    if (document.querySelector('.balloon')) return;
    Taskbar.balloon('Welcome to csabi.zip', isTouch
        ? 'Tap an icon to open it, or tap start.'
        : 'Double-click an icon to open it, or click start.');
}, 800);
