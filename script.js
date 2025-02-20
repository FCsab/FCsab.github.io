main = document.getElementById('main');

console.log(window.innerWidth);
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    telo();
} else szmito();

function szmito(){
    console.log('szmito');
}

function telo(){
    console.log('telo');
    var container = document.createElement('div');
    container.style.height = window.innerHeight + 10+ "px";
    container.style.width = window.innerWidth + 10 + "px";
    container.style.backgroundImage = "url('img/windows-xp-phone.png')";
    container.style.backgroundSize = "cover";


    instabut = document.createElement('div');
    instabut.style.position = "absolute";
    instabut.style.left = "15px";
    instabut.style.top = "15px";
    instabut.style.height = "90px";
    instabut.style.width = "60px";
    instabut.style.margin = "10px 10px 10px 10px";
    instabut.addEventListener('click', function(){
        window.location.href = "https://www.instagram.com/csabi.zip/";
    });

    spotibut = document.createElement('div');
    spotibut.style.position = "absolute";
    spotibut.style.left = "120px";
    spotibut.style.top = "15px";
    spotibut.style.height = "90px";
    spotibut.style.width = "60px";
    spotibut.style.margin = "10px 10px 10px 10px";
    spotibut.addEventListener('click', function(){
        window.location.href = "https://open.spotify.com/user/31khlgxohmflp7tkwtbr4shpaidm?si=7t5uLS6jTNGfVs3LbS8Qfg";
    });

    githubbut = document.createElement('div');
    githubbut.style.position = "absolute";
    githubbut.style.left = "225px";
    githubbut.style.top = "15px";
    githubbut.style.height = "90px";
    githubbut.style.width = "60px";
    githubbut.style.margin = "10px 10px 10px 10px";
    githubbut.addEventListener('click', function(){
        window.location.href = "https://github.com/FCsab";
    });



    container.appendChild(instabut);
    container.appendChild(spotibut);
    container.appendChild(githubbut);
    main.appendChild(container);
}