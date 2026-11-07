// ===== Secret: Konami code ↑ ↑ ↓ ↓ ← → ← → B A Enter opens snake.exe =====
(() => {
    const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
    let recentKeys = [];

    // --- LCD geometry (logical pixels, scaled up 4x) ---
    const W = 95, H = 62, SCALE = 4;
    const CELL = 4;              // 3px segment + 1px gap
    const COLS = 23, ROWS = 13;
    const OX = 2, OY = 9;        // playfield origin inside the border
    const BG = '#c7f0d8';
    const INK = '#43523d';

    // 3x5 pixel font, one number per row, bit 4 = left column
    const FONT = {
        0: [7, 5, 5, 5, 7], 1: [2, 6, 2, 2, 7], 2: [7, 1, 7, 4, 7], 3: [7, 1, 7, 1, 7], 4: [5, 5, 7, 1, 1],
        5: [7, 4, 7, 1, 7], 6: [7, 4, 7, 5, 7], 7: [7, 1, 1, 1, 1], 8: [7, 5, 7, 5, 7], 9: [7, 5, 7, 1, 7],
        A: [2, 5, 7, 5, 5], B: [6, 5, 6, 5, 6], C: [3, 4, 4, 4, 3], D: [6, 5, 5, 5, 6], E: [7, 4, 6, 4, 7],
        F: [7, 4, 6, 4, 4], G: [3, 4, 5, 5, 3], H: [5, 5, 7, 5, 5], I: [7, 2, 2, 2, 7], J: [1, 1, 1, 5, 2],
        K: [5, 5, 6, 5, 5], L: [4, 4, 4, 4, 7], M: [5, 7, 7, 5, 5], N: [6, 5, 5, 5, 5], O: [2, 5, 5, 5, 2],
        P: [6, 5, 6, 4, 4], Q: [2, 5, 5, 6, 3], R: [6, 5, 6, 5, 5], S: [3, 4, 2, 1, 6], T: [7, 2, 2, 2, 2],
        U: [5, 5, 5, 5, 7], V: [5, 5, 5, 5, 2], W: [5, 5, 7, 7, 5], X: [5, 5, 2, 5, 5], Y: [5, 5, 2, 2, 2],
        Z: [7, 1, 2, 4, 7], ' ': [0, 0, 0, 0, 0], ':': [0, 2, 0, 2, 0]
    };

    const ICON = 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">' +
        '<rect width="16" height="16" rx="2" fill="#43523d"/><rect x="1" y="1" width="14" height="14" fill="#c7f0d8"/>' +
        '<path fill="#43523d" d="M3 9h7v2H3zM8 5h2v4H8zM8 5h4v2H8z"/><path fill="#43523d" d="M4 4h1v1H4zM3 5h1v1H3zM5 5h1v1H5zM4 6h1v1H4z"/></svg>');

    // phones have no space bar: the keypad's 5 starts the game
    const START_TEXT = isTouch ? 'PRESS 5' : 'PRESS SPACE';

    let game = null;

    function openSnake() {
        if (game) {
            focusWindow('snake');
            return;
        }

        const wrap = document.createElement('div');
        wrap.className = 'snake-wrap';
        if (isTouch) wrap.classList.add('touch');
        wrap.innerHTML = `
            <div class="snake-inner">
                <div class="snake-bezel">
                    <div class="snake-lcd"><canvas width="${W * SCALE}" height="${H * SCALE}"></canvas></div>
                </div>
                <div class="snake-help">Arrows / WASD / 2 4 6 8 to move &middot; Space to start or pause</div>
                <div class="snake-keypad">
                    <span></span><button data-k="2">2<small>&#9650;</small></button><span></span>
                    <button data-k="4">4<small>&#9664;</small></button><button data-k="5">5<small>&#9679;</small></button><button data-k="6">6<small>&#9654;</small></button>
                    <span></span><button data-k="8">8<small>&#9660;</small></button><span></span>
                </div>
            </div>`;
        const canvas = wrap.querySelector('canvas');

        game = createGame(canvas);

        // on-screen keypad (touch screens): 2 up, 4 left, 6 right, 8 down, 5 start/pause
        const PAD = { 2: [0, -1], 4: [-1, 0], 6: [1, 0], 8: [0, 1] };
        wrap.querySelectorAll('.snake-keypad button').forEach(btn => {
            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                const k = btn.dataset.k;
                if (k === '5') game.action();
                else game.turn(...PAD[k]);
            });
        });

        openWindow({
            id: 'snake',
            title: 'snake.exe',
            icon: ICON,
            width: 440,
            height: 360,
            resizable: false,
            maximizeOnSmall: true,
            content: wrap,
            onClose: () => {
                game.stop();
                game = null;
            }
        });

        Taskbar.balloon('Found New Hardware', 'snake.exe has been installed and is ready to use.');
    }

    function createGame(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);

        let state = 'title';   // title | play | paused | dying | over
        let snake = [];
        let dir = { x: 1, y: 0 };
        let queue = [];
        let food = null;
        let score = 0;
        let speed = 150;
        let flashes = 0;
        let best = Number(localStorage.getItem('snake-best')) || 0;
        let timer = null;

        function reset() {
            snake = [{ x: 7, y: 6 }, { x: 6, y: 6 }, { x: 5, y: 6 }, { x: 4, y: 6 }];
            dir = { x: 1, y: 0 };
            queue = [];
            score = 0;
            speed = 150;
            placeFood();
            state = 'play';
        }

        function placeFood() {
            const free = [];
            for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLS; x++) {
                    if (!snake.some(s => s.x === x && s.y === y)) free.push({ x, y });
                }
            }
            food = free.length ? free[Math.floor(Math.random() * free.length)] : null;
        }

        function turn(nx, ny) {
            if (state !== 'play') return;
            const last = queue.length ? queue[queue.length - 1] : dir;
            if (last.x === -nx && last.y === -ny) return;   // no instant reverse
            if (last.x === nx && last.y === ny) return;
            if (queue.length < 2) queue.push({ x: nx, y: ny });
        }

        function action() {
            if (state === 'title' || state === 'over') reset();
            else if (state === 'play') state = 'paused';
            else if (state === 'paused') state = 'play';
        }

        function step() {
            if (queue.length) dir = queue.shift();
            const head = snake[0];
            // no maze: walk off one edge, appear on the other
            const next = { x: (head.x + dir.x + COLS) % COLS, y: (head.y + dir.y + ROWS) % ROWS };
            const eating = food && next.x === food.x && next.y === food.y;
            const body = eating ? snake : snake.slice(0, -1);
            if (body.some(s => s.x === next.x && s.y === next.y)) {
                state = 'dying';
                flashes = 6;
                return;
            }
            snake.unshift(next);
            if (eating) {
                score++;
                speed = Math.max(70, speed - 3);
                placeFood();
            } else {
                snake.pop();
            }
        }

        function tick() {
            const visible = isFocused('snake');
            if (state === 'play' && !visible) state = 'paused';

            if (state === 'play') {
                step();
            } else if (state === 'dying') {
                flashes--;
                if (flashes <= 0) {
                    state = 'over';
                    if (score > best) {
                        best = score;
                        localStorage.setItem('snake-best', String(best));
                    }
                }
            }
            draw();
            timer = setTimeout(tick, state === 'play' ? speed : 180);
        }

        // ----- drawing -----

        function px(x, y, w = 1, h = 1) {
            ctx.fillRect(x, y, w, h);
        }

        function text(str, x, y, size = 1) {
            [...String(str).toUpperCase()].forEach((ch, i) => {
                const glyph = FONT[ch] || FONT[' '];
                glyph.forEach((row, ry) => {
                    for (let cx = 0; cx < 3; cx++) {
                        if (row & (4 >> cx)) px(x + (i * 4 + cx) * size, y + ry * size, size, size);
                    }
                });
            });
        }

        function centerText(str, y, size = 1) {
            const width = (String(str).length * 4 - 1) * size;
            text(str, Math.floor((W - width) / 2), y, size);
        }

        function cellX(x) { return OX + x * CELL; }
        function cellY(y) { return OY + y * CELL; }

        function drawSnake() {
            snake.forEach((s, i) => {
                px(cellX(s.x), cellY(s.y), 3, 3);
                // fill the 1px gap to the next segment so the body looks solid
                const n = snake[i + 1];
                if (!n) return;
                if (n.y === s.y && Math.abs(n.x - s.x) === 1) px(cellX(Math.max(s.x, n.x)) - 1, cellY(s.y), 1, 3);
                if (n.x === s.x && Math.abs(n.y - s.y) === 1) px(cellX(s.x), cellY(Math.max(s.y, n.y)) - 1, 3, 1);
            });
            // eye on the head
            const h = snake[0];
            ctx.fillStyle = BG;
            const ex = dir.x === 1 ? 2 : dir.x === -1 ? 0 : 1;
            const ey = dir.y === 1 ? 2 : dir.y === -1 ? 0 : 1;
            px(cellX(h.x) + ex, cellY(h.y) + ey);
            ctx.fillStyle = INK;
        }

        function drawFood() {
            if (!food) return;
            const x = cellX(food.x), y = cellY(food.y);
            px(x + 1, y); px(x, y + 1); px(x + 2, y + 1); px(x + 1, y + 2);
        }

        function drawField() {
            text(String(score).padStart(4, '0'), 1, 1);
            px(0, 7, W, 1);           // top line
            px(0, 7, 1, H - 7);       // left
            px(W - 1, 7, 1, H - 7);   // right
            px(0, H - 1, W, 1);       // bottom
        }

        function box(lines, y) {
            const height = lines.length * 8 + 4;
            ctx.fillStyle = BG;
            px(14, y - 3, W - 28, height);
            ctx.fillStyle = INK;
            px(14, y - 3, W - 28, 1);
            px(14, y - 4 + height, W - 28, 1);
            lines.forEach((l, i) => centerText(l, y + i * 8));
        }

        function draw() {
            ctx.fillStyle = BG;
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = INK;

            if (state === 'title') {
                centerText('SNAKE', 10, 3);
                // little decorative snake
                px(30, 34, 30, 3); px(57, 28, 3, 6); px(57, 28, 8, 3);
                px(70, 34, 1, 1); px(69, 35, 1, 1); px(71, 35, 1, 1); px(70, 36, 1, 1);
                centerText(START_TEXT, 44);
                centerText('BEST ' + best, 53);
                return;
            }

            drawField();
            if (state === 'over') {
                centerText('GAME OVER', 14, 1);
                centerText('SCORE ' + score, 26);
                centerText('BEST ' + best, 34);
                centerText(START_TEXT, 48);
                return;
            }

            drawFood();
            // flash the snake when it bites itself
            if (state !== 'dying' || flashes % 2 === 0) drawSnake();
            if (state === 'paused') box(['PAUSED', isTouch ? '5 GO ON' : 'SPACE GO ON'], 24);
        }

        // ----- touch: swipe to turn, tap to start/pause -----
        let touchStart = null;
        canvas.addEventListener('pointerdown', (e) => {
            touchStart = { x: e.clientX, y: e.clientY };
        });
        canvas.addEventListener('pointerup', (e) => {
            if (!touchStart) return;
            const dx = e.clientX - touchStart.x;
            const dy = e.clientY - touchStart.y;
            touchStart = null;
            if (Math.hypot(dx, dy) < 20) {
                action();
            } else if (Math.abs(dx) > Math.abs(dy)) {
                turn(Math.sign(dx), 0);
            } else {
                turn(0, Math.sign(dy));
            }
        });

        draw();
        timer = setTimeout(tick, 180);

        return {
            turn,
            action,
            pause: () => { if (state === 'play') state = 'paused'; },
            stop: () => clearTimeout(timer)
        };
    }

    // Touch version of the secret: swipe ↑ ↑ ↓ ↓ ← → ← → on the empty desktop, then tap twice (B, A)
    const TOUCH_CODE = CODE.slice(0, 8).concat('tap', 'tap');
    let recentSwipes = [];
    let swipeStart = null;
    const desktopEl = document.getElementById('desktop');

    desktopEl.addEventListener('pointerdown', (e) => {
        swipeStart = e.pointerType === 'mouse' ? null : { x: e.clientX, y: e.clientY };
    });
    desktopEl.addEventListener('pointercancel', () => { swipeStart = null; });
    desktopEl.addEventListener('pointerup', (e) => {
        if (!swipeStart) return;
        const dx = e.clientX - swipeStart.x;
        const dy = e.clientY - swipeStart.y;
        swipeStart = null;
        let gesture;
        if (Math.hypot(dx, dy) < 15) gesture = 'tap';
        else if (Math.abs(dx) > Math.abs(dy)) gesture = dx > 0 ? 'ArrowRight' : 'ArrowLeft';
        else gesture = dy > 0 ? 'ArrowDown' : 'ArrowUp';

        recentSwipes = [...recentSwipes, gesture].slice(-TOUCH_CODE.length);
        if (recentSwipes.join() === TOUCH_CODE.join()) {
            recentSwipes = [];
            openSnake();
        }
    });

    const KEYS = {
        ArrowUp: [0, -1], w: [0, -1], 8: [0, -1],
        ArrowDown: [0, 1], s: [0, 1], 2: [0, 1],
        ArrowLeft: [-1, 0], a: [-1, 0], 4: [-1, 0],
        ArrowRight: [1, 0], d: [1, 0], 6: [1, 0]
    };

    document.addEventListener('keydown', (e) => {
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

        // secret code
        recentKeys = [...recentKeys, key].slice(-CODE.length);
        if (recentKeys.join() === CODE.join()) {
            recentKeys = [];
            e.preventDefault();
            openSnake();
            return;
        }

        // game controls, only while the snake window is the active one
        if (!game || !isFocused('snake')) return;
        if (KEYS[key]) {
            e.preventDefault();
            game.turn(...KEYS[key]);
        } else if (key === ' ' || key === 'Enter' || key === '5') {
            e.preventDefault();
            game.action();
        } else if (key === 'p') {
            game.pause();
        }
    });
})();
