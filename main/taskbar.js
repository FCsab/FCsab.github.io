// Taskbar: clock, start button, task buttons for open windows.
const Taskbar = (() => {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const taskArea = document.getElementById('task-area');
    const clock = document.getElementById('clock');

    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        clock.textContent = `${h}:${m}`;
        clock.title = now.toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }
    updateClock();
    setInterval(updateClock, 1000);

    function setStartMenu(open) {
        startMenu.hidden = !open;
        startButton.classList.toggle('active', open);
        startButton.setAttribute('aria-expanded', String(open));
    }

    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        setStartMenu(startMenu.hidden);
    });

    // Close the start menu when clicking anywhere else
    document.addEventListener('pointerdown', (e) => {
        if (startMenu.hidden) return;
        if (startMenu.contains(e.target) || startButton.contains(e.target)) return;
        setStartMenu(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setStartMenu(false);
    });

    // ----- System tray icons -----
    const trayIcons = document.getElementById('tray-icons');
    const chevron = document.getElementById('tray-chevron');

    const SVG = {
        messenger: '<svg viewBox="0 0 16 16"><circle cx="6" cy="4" r="2.6" fill="#4caf50" stroke="#1b5e20" stroke-width=".6"/><path d="M1.5 13c0-3.2 2-5 4.5-5s4.5 1.8 4.5 5z" fill="#4caf50" stroke="#1b5e20" stroke-width=".6"/><circle cx="10.5" cy="5" r="2.3" fill="#2f7de1" stroke="#0d3c8a" stroke-width=".6"/><path d="M7.5 13.5c.2-2.8 1.4-4.4 3-4.4 2 0 3.5 1.6 3.5 4.4z" fill="#2f7de1" stroke="#0d3c8a" stroke-width=".6"/></svg>',
        updates: '<svg viewBox="0 0 16 16"><path d="M8 1 2.5 3v5c0 3.2 2.4 5.6 5.5 7 3.1-1.4 5.5-3.8 5.5-7V3z" fill="#f7c21c" stroke="#8a6200" stroke-width=".7"/><path d="M8 4.5v5M5.5 7.5 8 10l2.5-2.5" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        hardware: '<svg viewBox="0 0 16 16"><rect x="1" y="6.5" width="10" height="7" rx="1" fill="#d4d4d4" stroke="#555" stroke-width=".7"/><rect x="2.5" y="8.5" width="2" height="3" fill="#888"/><path d="M8.5 7V3.5h3V1.5L15 4.5 11.5 7.5V5.5h-1.5V7z" fill="#3cb043" stroke="#1d6b1f" stroke-width=".6"/></svg>',
        security: '<svg viewBox="0 0 16 16"><path d="M8 1 2.5 3v5c0 3.2 2.4 5.6 5.5 7 3.1-1.4 5.5-3.8 5.5-7V3z" fill="#fff" stroke="#333" stroke-width=".7"/><path d="M7.6 2.1v5.5H3.2V3.5z" fill="#e84b2c"/><path d="M8.4 2.1v5.5h4.4V3.5z" fill="#5cb531"/><path d="M3.3 8.4h4.3v5.5C5.3 12.7 3.7 10.8 3.3 8.4z" fill="#2e7fe0"/><path d="M12.7 8.4H8.4v5.5c2.3-1.2 3.9-3.1 4.3-5.5z" fill="#f7c21c"/></svg>',
        network: '<svg viewBox="0 0 16 16"><rect x="1" y="1.5" width="8" height="6" rx=".5" fill="#e6e6e6" stroke="#444" stroke-width=".7"/><rect x="2" y="2.5" width="6" height="4" fill="#3a8ee6"/><rect x="3.5" y="7.6" width="3" height="1.4" fill="#777"/><rect x="7" y="7" width="8" height="6" rx=".5" fill="#e6e6e6" stroke="#444" stroke-width=".7"/><rect x="8" y="8" width="6" height="4" fill="#3a8ee6"/><rect x="9.5" y="13.1" width="3" height="1.4" fill="#777"/></svg>',
        volume: '<svg viewBox="0 0 16 16"><path d="M1.5 5.5h3l4-3.2v11.4l-4-3.2h-3z" fill="#eee" stroke="#444" stroke-width=".8" stroke-linejoin="round"/><path class="waves" d="M10.5 5.5c1 .9 1 4.1 0 5M12.4 3.8c1.9 1.7 1.9 6.7 0 8.4" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/><path class="mute" d="M10 5.5l5 5M15 5.5l-5 5" stroke="#e02b1f" stroke-width="1.8" stroke-linecap="round"/></svg>'
    };

    const trayItems = [
        { id: 'messenger', hidden: true, title: 'Messenger: csabi (Online)',
          click: () => balloon('Messenger', 'csabi is online. Say hi on instagram: @csabi.zip') },
        { id: 'updates', hidden: true, title: 'Automatic Updates',
          click: () => balloon('Updates are ready for your computer', 'Just kidding, csabi.zip is always up to date.') },
        { id: 'hardware', title: 'Safely Remove Hardware',
          click: () => balloon('Safe To Remove Hardware', "The 'USB Mass Storage Device' device can now be safely removed from the system.") },
        { id: 'security', title: 'Windows Security Alerts',
          click: () => balloon('Your computer might be at risk', 'Antivirus software might not be installed. Click this balloon to fix this problem.') },
        { id: 'network', title: 'Local Area Connection\nSpeed: 100.0 Mbps\nStatus: Connected',
          click: () => balloon('Local Area Connection is now connected', 'Speed: 100.0 Mbps') },
        { id: 'volume', title: 'Volume',
          click: (el) => {
              el.classList.toggle('muted');
              el.title = el.classList.contains('muted') ? 'Volume (muted)' : 'Volume';
          } }
    ];

    trayItems.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'tray-icon' + (item.hidden ? ' tray-hidden' : '');
        btn.title = item.title;
        btn.setAttribute('aria-label', item.title.split('\n')[0]);
        btn.innerHTML = SVG[item.id];
        btn.addEventListener('click', () => item.click(btn));
        trayIcons.appendChild(btn);
    });

    chevron.addEventListener('click', () => {
        const expanded = trayIcons.classList.toggle('expanded');
        chevron.classList.toggle('expanded', expanded);
        chevron.title = expanded ? 'Hide' : 'Show hidden icons';
    });

    function addTask(id, title, icon, onClick) {
        const btn = document.createElement('button');
        btn.className = 'task-button';
        btn.dataset.id = id;
        btn.title = title;
        if (icon) {
            const img = document.createElement('img');
            img.src = icon;
            img.alt = '';
            btn.appendChild(img);
        }
        const label = document.createElement('span');
        label.textContent = title;
        btn.appendChild(label);
        btn.addEventListener('click', onClick);
        taskArea.appendChild(btn);
        return btn;
    }

    function removeTask(id) {
        const btn = taskArea.querySelector(`[data-id="${id}"]`);
        if (btn) btn.remove();
    }

    function setActiveTask(id) {
        taskArea.querySelectorAll('.task-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.id === id);
        });
    }

    function balloon(title, text, timeout = 7000) {
        document.querySelectorAll('.balloon').forEach(b => b.remove());
        const tip = document.createElement('div');
        tip.className = 'balloon';
        const b = document.createElement('b');
        b.textContent = title;
        const close = document.createElement('button');
        close.className = 'balloon-close';
        close.textContent = '✕';
        close.addEventListener('click', () => tip.remove());
        tip.append(b, text, close);
        document.body.appendChild(tip);
        setTimeout(() => {
            tip.style.opacity = '0';
            setTimeout(() => tip.remove(), 400);
        }, timeout);
    }

    return { setStartMenu, addTask, removeTask, setActiveTask, balloon };
})();
