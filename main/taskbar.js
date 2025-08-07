function createTaskbar() {
    const oldTaskbar = document.getElementById('xp-taskbar');
    if (oldTaskbar) oldTaskbar.remove();
    const taskbar = document.createElement('div');
    taskbar.id = 'xp-taskbar';
    taskbar.style.position = 'fixed';
    taskbar.style.left = '0';
    taskbar.style.right = '0';
    taskbar.style.bottom = '0';
    taskbar.style.height = '40px';
    taskbar.style.background = 'linear-gradient(to top, #245edb 0%, #3a6ea5 100%)';
    taskbar.style.borderTop = '2px solid #bfcfe7';
    taskbar.style.display = 'flex';
    taskbar.style.alignItems = 'center';
    taskbar.style.justifyContent = 'flex-end';
    taskbar.style.zIndex = '10000';
    taskbar.style.boxShadow = '0 -2px 8px rgba(0,0,0,0.25)';
    taskbar.style.fontFamily = 'Tahoma, Verdana, Segoe UI, sans-serif';

    const taskArea = document.createElement('div');
    taskArea.id = 'xp-task-area';
    taskArea.style.flex = '1';
    taskArea.style.display = 'flex';
    taskArea.style.alignItems = 'center';
    taskArea.style.marginLeft = '12px';

    const clock = document.createElement('div');
    clock.id = 'xp-clock';
    clock.style.marginRight = '18px';
    clock.style.padding = '4px 14px 4px 14px';
    clock.style.background = 'rgba(255,255,255,0.18)';
    clock.style.borderRadius = '6px';
    clock.style.fontSize = '15px';
    clock.style.fontWeight = 'bold';
    clock.style.color = '#fff';
    clock.style.textShadow = '1px 1px 2px #245edb';

    function updateClock() {
        const now = new Date();
        let h = now.getHours();
        let m = now.getMinutes();
        if (h < 10) h = '0' + h;
        if (m < 10) m = '0' + m;
        clock.textContent = `${h}:${m}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    taskbar.appendChild(taskArea);
    taskbar.appendChild(clock);

    document.body.appendChild(taskbar);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createTaskbar);
} else {
    createTaskbar();
}