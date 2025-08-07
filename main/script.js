const body = document.getElementById('body');

body.style.backgroundImage = "url('img/windows-xp.jpg')";
body.style.backgroundSize = "cover";
body.style.backgroundRepeat = "no-repeat";
body.style.backgroundAttachment = "fixed";
body.style.minHeight = "100vh";
body.style.margin = "0";
body.style.padding = "0";
body.style.overflow = "hidden";

class Icon {
    constructor(name, img, link) {
        this.name = name;
        this.img = img;
        this.link = link;
        this.gridX = 0;
        this.gridY = 0;
    }
}

const icons = [
    new Icon('instagram', 'img/instagram.png', 'https://www.instagram.com/csabi.zip'),
    new Icon('spotify', 'img/spotify.png', 'https://open.spotify.com/user/31khlgxohmflp7tkwtbr4shpaidm?si=7t5uLS6jTNGfVs3LbS8Qfg'),
    new Icon('steam', 'img/steam.png', 'https://steamcommunity.com/id/csabidotzip/'),
    new Icon('github', 'img/github.png', 'https://github.com/FCsab'),
    new Icon('japanese', 'img/japan.png', 'https://csabi.zip/japan')
];

let iconSize = 72; // px
let iconSpacing = 24; // px
let iconsPerCol = 1;
let iconsPerRow = 1;

function calculateGrid() {
    // szamoljuk ki hany pixel kell az ikonoknak
    const w = window.innerWidth;
    const h = window.innerHeight - 48; // hely a taskbarnak
    iconsPerCol = Math.floor(h / (iconSize + iconSpacing));
    iconsPerRow = Math.max(1, Math.floor(w / (iconSize + iconSpacing)));
    icons.forEach((icon, i) => {
        icon.gridX = Math.floor(i / iconsPerCol);
        icon.gridY = i % iconsPerCol;
    });
}

function getIconPosition(icon) {
    const left = 24 + icon.gridX * (iconSize + iconSpacing);
    const top = 24 + icon.gridY * (iconSize + iconSpacing);
    return { left, top };
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function createIcons() {
    let iconContainer = document.getElementById('icon-container');
    if (iconContainer) iconContainer.remove();

    iconContainer = document.createElement('div');
    iconContainer.id = 'icon-container';
    iconContainer.style.position = 'absolute';
    iconContainer.style.top = '0';
    iconContainer.style.left = '0';
    iconContainer.style.width = '100vw';
    iconContainer.style.height = '100vh';
    iconContainer.style.pointerEvents = 'none';

    icons.forEach((icon, index) => {
        const icongen = document.createElement('div');
        icongen.classList.add('desktop-icon');
        icongen.style.position = 'absolute';
        const { left, top } = getIconPosition(icon);
        icongen.style.left = `${left}px`;
        icongen.style.top = `${top}px`;
        icongen.style.display = 'flex';
        icongen.style.flexDirection = 'column';
        icongen.style.alignItems = 'center';
        icongen.style.width = `${iconSize}px`;
        icongen.style.cursor = 'pointer';
        icongen.style.userSelect = 'none';
        icongen.style.pointerEvents = 'auto';
        icongen.style.touchAction = 'none';

        const img = document.createElement('img');
        img.src = icon.img;
        img.alt = icon.name;
        img.style.width = `${iconSize - 8}px`;
        img.style.height = `${iconSize - 8}px`;
        img.style.maxWidth = '100%';

        const icontext = document.createElement('p');
        icontext.innerText = icon.name;
        icontext.style.textAlign = 'center';
        icontext.style.marginTop = '5px';
        icontext.style.color = 'white';
        icontext.style.fontFamily = 'Tahoma, sans-serif';
        icontext.style.fontSize = 'clamp(12px, 2vw, 16px)';
        icontext.style.textShadow = '1px 1px 2px rgba(0,0,0,0.7)';

        icongen.appendChild(img);
        icongen.appendChild(icontext);

        icongen._iconIndex = index;

        let dragStartX = 0, dragStartY = 0;
        let dragIconStartPositions = [];
        let dragMoved = false;
        let dragActive = false;
        let dragPointerId = null;

        icongen.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return;
            if (isSelecting) return;
            dragMoved = false;
            dragActive = true;
            dragPointerId = null;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            if (!icongen.classList.contains('selected')) {
                clearSelection();
                icongen.classList.add('selected');
            }
            dragIconStartPositions = getIconElements()
                .filter(div => div.classList.contains('selected'))
                .map(div => ({
                    div,
                    startLeft: parseInt(div.style.left, 10),
                    startTop: parseInt(div.style.top, 10)
                }));

            function onMouseMove(ev) {
                const dx = ev.clientX - dragStartX;
                const dy = ev.clientY - dragStartY;
                if (!dragMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
                    dragMoved = true;
                    isDragging = true;
                }
                if (dragMoved) {
                    dragIconStartPositions.forEach(({div, startLeft, startTop}) => {
                        div.style.left = `${startLeft + dx}px`;
                        div.style.top = `${startTop + dy}px`;
                    });
                }
            }

            function onMouseUp(ev) {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                if (dragMoved) {
                    isDragging = false;
                    dragActive = false;
                    dragIconStartPositions = [];
                    // px - grid konvertalas, fix1
                    getIconElements().forEach((div, idx) => {
                        const left = parseInt(div.style.left, 10);
                        const top = parseInt(div.style.top, 10);
                        let gridX = Math.round((left - 24) / (iconSize + iconSpacing));
                        let gridY = Math.round((top - 24) / (iconSize + iconSpacing));
                        // fix2
                        gridX = clamp(gridX, 0, iconsPerRow - 1);
                        gridY = clamp(gridY, 0, iconsPerCol - 1);
                        icons[idx].gridX = gridX;
                        icons[idx].gridY = gridY;
                    });
                    redrawIcons();
                    ev.preventDefault();
                } else {
                    // ha csak sima kattintas, akkor nyisson meg paget
                    window.open(icon.link, '_blank');
                }
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        });

        icongen.addEventListener('touchstart', function(e) {
            if (isSelecting) return;
            if (e.touches.length > 1) return; // ha tobbszor nyom ra ignoralja
            dragMoved = false;
            dragActive = true;
            dragPointerId = e.touches[0].identifier;
            const touch = e.touches[0];
            dragStartX = touch.clientX;
            dragStartY = touch.clientY;
            if (!icongen.classList.contains('selected')) {
                clearSelection();
                icongen.classList.add('selected');
            }
            dragIconStartPositions = getIconElements()
                .filter(div => div.classList.contains('selected'))
                .map(div => ({
                    div,
                    startLeft: parseInt(div.style.left, 10),
                    startTop: parseInt(div.style.top, 10)
                }));
        }, { passive: true });

        icongen.addEventListener('touchmove', function(e) {
            if (!dragActive) return;
            let touch = null;
            for (let i = 0; i < e.touches.length; i++) {
                if (e.touches[i].identifier === dragPointerId) {
                    touch = e.touches[i];
                    break;
                }
            }
            if (!touch) return;
            const dx = touch.clientX - dragStartX;
            const dy = touch.clientY - dragStartY;
            if (!dragMoved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
                dragMoved = true;
                isDragging = true;
            }
            if (dragMoved) {
                dragIconStartPositions.forEach(({div, startLeft, startTop}) => {
                    div.style.left = `${startLeft + dx}px`;
                    div.style.top = `${startTop + dy}px`;
                });
            }
            e.preventDefault();
        }, { passive: false });

        icongen.addEventListener('touchend', function(e) {
            if (!dragActive) return;
            dragActive = false;
            isDragging = false;
            dragPointerId = null;
            if (dragMoved) {
                getIconElements().forEach((div, idx) => {
                    const left = parseInt(div.style.left, 10);
                    const top = parseInt(div.style.top, 10);
                    let gridX = Math.round((left - 24) / (iconSize + iconSpacing));
                    let gridY = Math.round((top - 24) / (iconSize + iconSpacing));
                    // fix3
                    gridX = clamp(gridX, 0, iconsPerRow - 1);
                    gridY = clamp(gridY, 0, iconsPerCol - 1);
                    icons[idx].gridX = gridX;
                    icons[idx].gridY = gridY;
                });
                redrawIcons();
            } else {
                window.open(icon.link, '_blank');
            }
            dragIconStartPositions = [];
            e.preventDefault();
        }, { passive: false });

        iconContainer.appendChild(icongen);
    });

    body.appendChild(iconContainer);
    refreshDragHandlers();
}

function redrawIcons() {
    getIconElements().forEach((iconDiv, i) => {
        const icon = icons[i];
        const { left, top } = getIconPosition(icon);
        iconDiv.style.left = `${left}px`;
        iconDiv.style.top = `${top}px`;
        iconDiv.style.width = `${iconSize}px`;
    });
}


let selectionRect = null;
let startX = 0, startY = 0;
let isSelecting = false;

function getIconElements() {
    return Array.from(document.querySelectorAll('#icon-container > .desktop-icon'));
}

function clearSelection() {
    getIconElements().forEach(iconDiv => {
        iconDiv.classList.remove('selected');
    });
}

function selectIconsInRect(rect) {
    getIconElements().forEach(iconDiv => {
        const iconRect = iconDiv.getBoundingClientRect();
        if (
            rect.left < iconRect.right &&
            rect.right > iconRect.left &&
            rect.top < iconRect.bottom &&
            rect.bottom > iconRect.top
        ) {
            iconDiv.classList.add('selected');
        } else {
            iconDiv.classList.remove('selected');
        }
    });
}

let isDragging = false;

function addDragHandlers(iconDiv) {
    // mar nem szukseges, mas logika kezeli
}

function refreshDragHandlers() {
    // mar nem szukseges, mas logika kezeli
}

body.addEventListener('mousemove', function(e) {
    if (!isSelecting || !selectionRect) return;
    handleSelectionMove(e.clientX, e.clientY);
});

body.addEventListener('mouseup', function(e) {
    if (!isSelecting) return;
    isSelecting = false;
    if (selectionRect) {
        selectionRect.remove();
        selectionRect = null;
    }
});

body.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (isSelecting && selectionRect) {
            handleSelectionMove(touch.clientX, touch.clientY);
        }
    }
}, { passive: false });

body.addEventListener('touchend', function(e) {
    if (isSelecting && selectionRect) {
        isSelecting = false;
        selectionRect.remove();
        selectionRect = null;
    }
}, { passive: false });


function handleSelectionMove(clientX, clientY) {
    const rectLeft = Math.min(startX, clientX);
    const rectTop = Math.min(startY, clientY);
    const rectWidth = Math.abs(clientX - startX);
    const rectHeight = Math.abs(clientY - startY);

    selectionRect.style.left = `${rectLeft}px`;
    selectionRect.style.top = `${rectTop}px`;
    selectionRect.style.width = `${rectWidth}px`;
    selectionRect.style.height = `${rectHeight}px`;

    const selectionBox = {
        left: rectLeft,
        top: rectTop,
        right: rectLeft + rectWidth,
        bottom: rectTop + rectHeight
    };
    selectIconsInRect(selectionBox);
}

body.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    if (e.target.closest('#icon-container > .desktop-icon')) return;
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    clearSelection();
    selectionRect = document.createElement('div');
    selectionRect.id = 'selection-rect';
    selectionRect.style.position = 'fixed';
    selectionRect.style.zIndex = '9999';
    selectionRect.style.border = '1.5px dashed #3399ff';
    selectionRect.style.background = 'rgba(51,153,255,0.15)';
    selectionRect.style.pointerEvents = 'none';
    selectionRect.style.left = `${startX}px`;
    selectionRect.style.top = `${startY}px`;
    selectionRect.style.width = '0px';
    selectionRect.style.height = '0px';
    document.body.appendChild(selectionRect);
});

body.addEventListener('touchstart', function(e) {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    if (e.target.closest('#icon-container > .desktop-icon')) return;
    isSelecting = true;
    startX = touch.clientX;
    startY = touch.clientY;
    clearSelection();
    selectionRect = document.createElement('div');
    selectionRect.id = 'selection-rect';
    selectionRect.style.position = 'fixed';
    selectionRect.style.zIndex = '9999';
    selectionRect.style.border = '1.5px dashed #3399ff';
    selectionRect.style.background = 'rgba(51,153,255,0.15)';
    selectionRect.style.pointerEvents = 'none';
    selectionRect.style.left = `${startX}px`;
    selectionRect.style.top = `${startY}px`;
    selectionRect.style.width = '0px';
    selectionRect.style.height = '0px';
    document.body.appendChild(selectionRect);
}, { passive: false });

const selectionStyle = document.createElement('style');
selectionStyle.textContent = `
    #icon-container > .desktop-icon.selected {
        background: rgba(51,153,255,0.25);
        border-radius: 8px;
        box-shadow: 0 0 0 2px #3399ff;
    }
    #icon-container > .desktop-icon {
        transition: box-shadow 0.1s, background 0.1s;
        touch-action: none;
    }
    #selection-rect {
        pointer-events: none;
    }
    @media (max-width: 600px) {
        #icon-container > .desktop-icon {
            width: 56px !important;
        }
        #icon-container img {
            width: 48px !important;
            height: 48px !important;
        }
    }
`;
document.head.appendChild(selectionStyle);

function responsiveRedraw() {
    if (window.innerWidth < 600) {
        iconSize = 56;
        iconSpacing = 12;
    } else {
        iconSize = 72;
        iconSpacing = 24;
    }
    calculateGrid();
    redrawIcons();
}
window.addEventListener('resize', () => {
    responsiveRedraw();
});

calculateGrid();
createIcons();
responsiveRedraw();