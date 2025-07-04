const body = document.getElementById('body');

body.style.backgroundImage = "url('img/windows-xp.jpg')";
body.style.backgroundSize = "cover";
body.style.backgroundRepeat = "no-repeat";
body.style.backgroundAttachment = "fixed";
body.style.minHeight = "100vh";
body.style.margin = "0";
body.style.padding = "0";

class Icon {
    constructor(name, img, link) {
        this.name = name;
        this.img = img;
        this.link = link;
    }
}

const instagram = new Icon('instagram', 'img/instagram.png', 'https://www.instagram.com/csabi.zip');
const spotify = new Icon('spotify', 'img/spotify.png', 'https://open.spotify.com/user/31khlgxohmflp7tkwtbr4shpaidm?si=7t5uLS6jTNGfVs3LbS8Qfg');
const steam = new Icon('steam', 'img/steam.png', 'https://steamcommunity.com/id/csabidotzip/');
const github = new Icon('github', 'img/github.png', 'https://github.com/FCsab');

const icons = [instagram, spotify, steam, github];

function createIcons() {
    const iconContainer = document.createElement('div');
    iconContainer.id = 'icon-container';
    iconContainer.style.display = 'flex';
    iconContainer.style.flexDirection = 'column';
    iconContainer.style.alignItems = 'flex-start';
    iconContainer.style.padding = '20px';
    iconContainer.style.boxSizing = 'border-box';
    iconContainer.style.position = 'absolute';
    iconContainer.style.top = '20px';
    iconContainer.style.left = '20px';

    icons.forEach((icon, index) => {
        const icongen = document.createElement('div');
        icongen.style.display = 'flex';
        icongen.style.flexDirection = 'column';
        icongen.style.alignItems = 'center';
        icongen.style.marginBottom = '20px';
        icongen.style.cursor = 'pointer';

        const img = document.createElement('img');
        img.src = icon.img;
        img.alt = icon.name;
        img.style.width = '64px';
        img.style.height = '64px';
        img.style.maxWidth = '100%';

        const icontext = document.createElement('p');
        icontext.innerText = icon.name;
        icontext.style.textAlign = 'center';
        icontext.style.marginTop = '5px';
        icontext.style.color = 'white';
        icontext.style.fontFamily = 'Tahoma, sans-serif';
        icontext.style.fontSize = '14px';
        icontext.style.textShadow = '1px 1px 2px rgba(0,0,0,0.7)';

        icongen.appendChild(img);
        icongen.appendChild(icontext);

        icongen.addEventListener('click', function() {
            window.open(icon.link, '_blank');
        });

        iconContainer.appendChild(icongen);
    });

    body.appendChild(iconContainer);
}

createIcons();

const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
document.head.appendChild(meta);

const style = document.createElement('style');
style.textContent = `
    body {
        font-size: 16px;
        line-height: 1.5;
    }
    @media (max-width: 600px) {
        body {
            font-size: 14px;
        }
        #icon-container {
            padding: 10px;
        }
        #icon-container > div {
            margin-bottom: 10px;
        }
    }
`;
document.head.appendChild(style);
