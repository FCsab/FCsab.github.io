// Language data
const langData = {
   hu: {
      loadingH1: '<span><i class="fa fa-cogs"></i></span> ÉLETRAJZ RENDSZER INICIALIZÁLÁSA<span id="loading">.</span>',
      greeting: 'ÉLETRAJZ PROTOKOLL SIKERESEN INICIALIZÁLVA',
      message: 'FARAGÓ CSABA SZEMÉLYES ADATAINAK BETÖLTÉSE FOLYAMATBAN...',
      loadingMessage2: 'SZEMÉLYES ADATOK BETÖLTÉSE<span id="alpha-loading"></span>.',
      name: 'NÉV: FARAGÓ CSABA',
      alias: 'ELÉRHETŐSÉG: CSABI@CSABI.ZIP | TELEFON: +36 70 336 7014',
      occupation: 'JELENLEGI POZÍCIÓ: SZOFTVERFEJLESZTŐ HALLGATÓ | BUDAPEST IV. KERÜLET',
      frontEnd: 'TANULMÁNYOK: BUDAPESTI MŰSZAKI SZAKKÉPZÉSI CENTRUM EGRESSY GÁBOR TECHNIKUM',
      jsFrameworks: 'SZAKMA: SZOFTVERFEJLESZTŐ ÉS -TESZTELŐ (2020 - FOLYAMATBAN)',
      jsLibs: 'VÁRHATÓ BEFEJEZÉS: 2025 - SZAKMAI ÉRETTSÉGI ÉS SZAKMAI GYAKORLAT',
      cssFrameworks: 'SZÜLETÉSI DÁTUM: 2005. FEBRUÁR 2.',
      cssPre: 'ANGOL NYELVISMERET: MAGAS SZINTŰ (C1 SZINT)',
      frontEndAnimation: 'LINUX RENDSZERISMERET: MINDENNAPI HASZNÁLAT ÉS SZERVER ADMINISZTRÁCIÓ (DEBIAN, FEDORA, ARCH)',
      windowsKnowledge: 'WINDOWS RENDSZERISMERET: MAGAS SZINTŰ OPERÁCIÓS RENDSZER ISMERETEK',
      programming: 'PROGRAMOZÁSI NYELVEK ÉS TECHNOLÓGIÁK: PYTHON, GO, HTML, CSS, JAVASCRIPT, C++, C#, DOCKER',
      cad3d: '3D TERVEZÉSI ISMERETEK: 1 ÉV TAPASZTALAT (SOLID EDGE, FUSION360)',
      microcontroller: 'MIKROKONTROLLER PROGRAMOZÁS: ESP32 FEJLESZTÉSI KÖRNYEZET',
      hardwareMaintenance: 'HARDVER ISMERETEK: SZÁMÍTÓGÉP SZERELÉS ÉS KARBANTARTÁS',
      networking: 'HÁLÓZATI ISMERETEK: 1 ÉV ELMÉLETI ÉS GYAKORLATI TANULMÁNYOK',
      cmsDevelopment: 'SZEMÉLYES KOMPETENCIÁK: MAGAS SZINTŰ DIGITÁLIS JÁRTASSÁG ÉS GYORS TANULÁSI KÉSZSÉG',
      wordpress: 'KOMMUNIKÁCIÓS KÉSZSÉGEK: KIVÁLÓ SZÓBELI ÉS ÍRÁSBELI KOMMUNIKÁCIÓ',
      design: 'MOTIVÁCIÓ ÉS CÉLOK: SZAKMAI TAPASZTALATSZERZÉS ÉS TUDÁS GYAKORLATI ALKALMAZÁSA',
      webDesign: 'CSAPATMUNKA: MAGABIZTOS TELJESÍTMÉNY EGYÉNI ÉS CSOPORTOS PROJEKTEKBEN',
      branding: 'SZABADIDŐS TEVÉKENYSÉGEK: PROGRAMOZÁSI PROJEKTEK ÉS ROBOTIKAI KÍSÉRLETEK',
      designAnimation: 'DESIGN ANIMÁCIÓK: ALAP SZINTŰ ISMERETEK'
   },
   en: {
      loadingH1: '<span><i class="fa fa-cogs"></i></span> INITIALIZING RESUME SYSTEM<span id="loading">.</span>',
      greeting: 'RESUME PROTOCOL SUCCESSFULLY INITIALIZED',
      message: 'LOADING PERSONAL DATA OF CSABA FARAGÓ...',
      loadingMessage2: 'LOADING PERSONAL DATA<span id="alpha-loading"></span>.',
      name: 'NAME: CSABA FARAGÓ',
      alias: 'CONTACT: CSABI@CSABI.ZIP | PHONE: +36 70 336 7014',
      occupation: 'CURRENT POSITION: SOFTWARE DEVELOPER STUDENT | BUDAPEST, DISTRICT IV',
      frontEnd: 'STUDIES: BUDAPEST TECHNICAL VOCATIONAL TRAINING CENTER EGRESSY GÁBOR TECHNIKUM',
      jsFrameworks: 'PROFESSION: SOFTWARE DEVELOPER AND TESTER (2020 - ONGOING)',
      jsLibs: 'EXPECTED GRADUATION: 2025 - PROFESSIONAL MATRICULATION AND INTERNSHIP',
      cssFrameworks: 'DATE OF BIRTH: FEBRUARY 2, 2005',
      cssPre: 'ENGLISH LANGUAGE SKILLS: HIGH LEVEL (C1)',
      frontEndAnimation: 'LINUX SYSTEM KNOWLEDGE: DAILY USE AND SERVER ADMINISTRATION (DEBIAN, FEDORA, ARCH)',
      windowsKnowledge: 'WINDOWS SYSTEM KNOWLEDGE: HIGH LEVEL OPERATING SYSTEM SKILLS',
      programming: 'PROGRAMMING LANGUAGES & TECHNOLOGIES: PYTHON, GO, HTML, CSS, JAVASCRIPT, C++, C#, DOCKER',
      cad3d: '3D DESIGN KNOWLEDGE: 1 YEAR EXPERIENCE (SOLID EDGE, FUSION360)',
      microcontroller: 'MICROCONTROLLER PROGRAMMING: ESP32 DEVELOPMENT ENVIRONMENT',
      hardwareMaintenance: 'HARDWARE KNOWLEDGE: COMPUTER ASSEMBLY AND MAINTENANCE',
      networking: 'NETWORKING KNOWLEDGE: 1 YEAR THEORETICAL AND PRACTICAL STUDIES',
      cmsDevelopment: 'PERSONAL COMPETENCIES: HIGH LEVEL DIGITAL LITERACY & FAST LEARNING SKILLS',
      wordpress: 'COMMUNICATION SKILLS: EXCELLENT VERBAL AND WRITTEN COMMUNICATION',
      design: 'MOTIVATION & GOALS: GAINING PROFESSIONAL EXPERIENCE & PRACTICAL APPLICATION OF KNOWLEDGE',
      webDesign: 'TEAMWORK: CONFIDENT PERFORMANCE IN INDIVIDUAL AND GROUP PROJECTS',
      branding: 'LEISURE ACTIVITIES: PROGRAMMING PROJECTS & ROBOTICS EXPERIMENTS',
      designAnimation: 'DESIGN ANIMATIONS: BASIC KNOWLEDGE'
   }
};

function getLang() {
   const params = new URLSearchParams(window.location.search);
   return params.get('en') === 'true' || !params.has('en') ? 'en' : 'hu';
}

function setInitialLangContent(lang) {
   const d = langData[lang];
   // Only set the loading message initially
   $("#loadingH1").html(d.loadingH1);
   $("#loadingMessage2").html(d.loadingMessage2);
   
   // Clear all other text elements so they can be typed in
   $("#greeting").text("");
   $("#message").text("");
   $("#name").text("");
   $("#alias").text("");
   $("#occupation").text("");
   $("#front-end").text("");
   $("#js-frameworks").text("");
   $("#js-libs").text("");
   $("#css-frameworks").text("");
   $("#css-pre").text("");
   $("#front-end-animation").text("");
   $("#windows-knowledge").text("");
   $("#programming").text("");
   $("#cad-3d").text("");
   $("#microcontroller").text("");
   $("#hardware-maintenance").text("");
   $("#networking").text("");
   $("#CMS-development").text("");
   $("#wordpress").text("");
   $("#design").text("");
   $("#web-design").text("");
   $("#branding").text("");
   $("#design-animation").text("");
}

// Set language content first
var lang = getLang();
var d = langData[lang];
setInitialLangContent(lang);

// Now start the loading animation
var initDot = document.getElementById("loading");
var loading = setInterval(function() {
      if(initDot.innerHTML.length == 5) {
            initDot.innerHTML = "";
      } else {
            initDot.innerHTML += ".";
      }
}, 350); // Dot Speed

var $loadingMessage = $('#loadingH1');

setTimeout(function() {
         clearInterval(loading);
         $loadingMessage.hide();
    }, 1500);

setTimeout(function(){

   function initIdentityResults(i){
      $("#message").addClass("sign cursor").text(d.message.substring(0, i));
      if(i < d.message.length){
         setTimeout(function(){
            initIdentityResults(i + 1);
         }, 15);
      }else{
         $('#message').removeClass("cursor");
         var loadingResume = function(){
            $("#loadingMessage2").show()
            var dotAlpha = document.getElementById("alpha-loading");
            var loadingAlpha = setInterval(function() {
               if(dotAlpha.innerHTML.length == 6) {
                  dotAlpha.innerHTML = "";
               } else {
                  dotAlpha.innerHTML += ".";
                  setTimeout(function() {
                     clearInterval(loadingAlpha);
                     $("#loadingMessage2").hide();
                  }, 2000);
               }
            }, 350);  // Dot Speed
         }
         loadingResume();
         function initName(i){
            $("#name").addClass("sign cursor").text(d.name.substring(0, i));
            if(i < d.name.length){
               setTimeout(function(){
                  initName(i + 1);
               }, 15);
            }else{
               $("#name").removeClass("cursor");
               setTimeout(function() {
                  initAlias(0);
               }, 500);
            }
         }
         setTimeout(function() {
            initName(0);
         }, 2500);
      }
      function initAlias(i){
         $("#alias").addClass("sign cursor").text(d.alias.substring(0, i));
         if(i < d.alias.length){
            setTimeout(function(){
               initAlias(i + 1);
            }, 15);
         }else{
            $("#alias").removeClass("cursor");
            setTimeout(function() {
               initOccupation(0);
            }, 500);
         }
      }
      function initOccupation(i){
         $("#occupation").addClass("sign cursor").text(d.occupation.substring(0, i));
         if(i < d.occupation.length){
            setTimeout(function(){
               initOccupation(i + 1);
            }, 15);
         }else{
            $("#occupation").removeClass("cursor");
            setTimeout(function() {
               initFrontEnd(0);
            }, 500);
         }
      }
      function initFrontEnd(i){
         $("#front-end").addClass("sign cursor").text(d.frontEnd.substring(0, i));
         if(i < d.frontEnd.length){
            setTimeout(function(){
               initFrontEnd(i + 1);
            }, 15);
         }else{
            $("#front-end").removeClass("cursor");
            setTimeout(function() {
               initJSFrameworks(0);
            }, 500);
         }
      }
      function initJSFrameworks(i){
         $("#js-frameworks").addClass("sign cursor").text(d.jsFrameworks.substring(0, i));
         if(i < d.jsFrameworks.length){
            setTimeout(function(){
               initJSFrameworks(i + 1);
            }, 15);
         }else{
            $("#js-frameworks").removeClass("cursor");
            setTimeout(function() {
               initJSLibs(0);
            }, 500);
         }
      }
      function initJSLibs(i){
         $("#js-libs").addClass("sign cursor").text(d.jsLibs.substring(0, i));
         if(i < d.jsLibs.length){
            setTimeout(function(){
               initJSLibs(i + 1);
            }, 15);
         }else{
            $("#js-libs").removeClass("cursor");
            setTimeout(function() {
               initCSSFrameworks(0);
            }, 500);
         }
      }
      function initCSSFrameworks(i){
         $("#css-frameworks").addClass("sign cursor").text(d.cssFrameworks.substring(0, i));
         if(i < d.cssFrameworks.length){
            setTimeout(function(){
               initCSSFrameworks(i + 1);
            }, 15);
         }else{
            $("#css-frameworks").removeClass("cursor");
            setTimeout(function() {
               initCSSPre(0);
            }, 500);
         }
      }
      function initCSSPre(i){
         $("#css-pre").addClass("sign cursor").text(d.cssPre.substring(0, i));
         if(i < d.cssPre.length){
            setTimeout(function(){
               initCSSPre(i + 1);
            }, 15);
         }else{
            $("#css-pre").removeClass("cursor");
            setTimeout(function() {
               initFrontEndAnimation(0);
            }, 500);
         }
      }
      function initFrontEndAnimation(i){
         $("#front-end-animation").addClass("sign cursor").text(d.frontEndAnimation.substring(0, i));
         if(i < d.frontEndAnimation.length){
            setTimeout(function(){
               initFrontEndAnimation(i + 1);
            }, 15);
         }else{
            $("#front-end-animation").removeClass("cursor");
            setTimeout(function() {
               initWindowsKnowledge(0);
            }, 500);
         }
      }
      function initWindowsKnowledge(i){
         $("#windows-knowledge").addClass("sign cursor").text(d.windowsKnowledge.substring(0, i));
         if(i < d.windowsKnowledge.length){
            setTimeout(function(){
               initWindowsKnowledge(i + 1);
            }, 15);
         }else{
            $("#windows-knowledge").removeClass("cursor");
            setTimeout(function() {
               initProgramming(0);
            }, 500);
         }
      }
      function initProgramming(i){
         $("#programming").addClass("sign cursor").text(d.programming.substring(0, i));
         if(i < d.programming.length){
            setTimeout(function(){
               initProgramming(i + 1);
            }, 15);
         }else{
            $("#programming").removeClass("cursor");
            setTimeout(function() {
               initCad3d(0);
            }, 500);
         }
      }
      function initCad3d(i){
         $("#cad-3d").addClass("sign cursor").text(d.cad3d.substring(0, i));
         if(i < d.cad3d.length){
            setTimeout(function(){
               initCad3d(i + 1);
            }, 15);
         }else{
            $("#cad-3d").removeClass("cursor");
            setTimeout(function() {
               initMicrocontroller(0);
            }, 500);
         }
      }
      function initMicrocontroller(i){
         $("#microcontroller").addClass("sign cursor").text(d.microcontroller.substring(0, i));
         if(i < d.microcontroller.length){
            setTimeout(function(){
               initMicrocontroller(i + 1);
            }, 15);
         }else{
            $("#microcontroller").removeClass("cursor");
            setTimeout(function() {
               initHardwareMaintenance(0);
            }, 500);
         }
      }
      function initHardwareMaintenance(i){
         $("#hardware-maintenance").addClass("sign cursor").text(d.hardwareMaintenance.substring(0, i));
         if(i < d.hardwareMaintenance.length){
            setTimeout(function(){
               initHardwareMaintenance(i + 1);
            }, 15);
         }else{
            $("#hardware-maintenance").removeClass("cursor");
            setTimeout(function() {
               initNetworking(0);
            }, 500);
         }
      }
      function initNetworking(i){
         $("#networking").addClass("sign cursor").text(d.networking.substring(0, i));
         if(i < d.networking.length){
            setTimeout(function(){
               initNetworking(i + 1);
            }, 15);
         }else{
            $("#networking").removeClass("cursor");
            setTimeout(function() {
               initCMSDevelopment(0);
            }, 500);
         }
      }
      function initCMSDevelopment(i){
         $("#CMS-development").addClass("sign cursor").text(d.cmsDevelopment.substring(0, i));
         if(i < d.cmsDevelopment.length){
            setTimeout(function(){
               initCMSDevelopment(i + 1);
            }, 15);
         }else{
            $("#CMS-development").removeClass("cursor");
            setTimeout(function() {
               initWordpress(0);
            }, 500);
         }
      }
      function initWordpress(i){
         $("#wordpress").addClass("sign cursor").text(d.wordpress.substring(0, i));
         if(i < d.wordpress.length){
            setTimeout(function(){
               initWordpress(i + 1);
            }, 15);
         }else{
            $("#wordpress").removeClass("cursor");
            setTimeout(function() {
               initDesign(0);
            }, 500);
         }
      }
      function initDesign(i){
         $('#design-span').addClass('fa fa-user');
         $('#design').addClass("cursor").text(d.design.substring(0, i));
         if(i < d.design.length){
            setTimeout(function(){
               initDesign(i + 1);
            }, 15);
         }else{
            $('#design').removeClass("cursor");
            setTimeout(function() {
               initWebDesign(0);
            }, 500);
         }
      }
      function initWebDesign(i){
         $('#web-design').addClass("sign cursor").text(d.webDesign.substring(0, i));
         if(i < d.webDesign.length){
            setTimeout(function(){
               initWebDesign(i + 1);
            }, 15);
         }else{
            $('#web-design').removeClass("cursor");
            setTimeout(function() {
               initBranding(0);
            }, 500);
         }
      }
      function initBranding(i){
         $('#branding').addClass("sign cursor").text(d.branding.substring(0, i));
         if(i < d.branding.length){
            setTimeout(function(){
               initBranding(i + 1);
            }, 15);
         }else{
            $('#branding').removeClass("cursor");
            setTimeout(function() {
               initDesignAnimation(0);
            }, 500);
         }
      }
      function initDesignAnimation(i){
         $('#design-animation').addClass("sign cursor").text(d.designAnimation.substring(0, i));
         if(i < d.designAnimation.length){
            setTimeout(function(){
               initDesignAnimation(i + 1);
            }, 15);
         }else{
            //$('#design-animation').removeClass("cursor");
         }
      }
   }
   function initProgramAlpha(i){
      $("#greeting").addClass("cursor").text(d.greeting.substring(0, i));
      if(i < d.greeting.length){
         setTimeout(function(){
            initProgramAlpha(i + 1);
         }, 15);
      }else{
         $("#greeting").removeClass("cursor");
         initIdentityResults(0);
      }
   }
   initProgramAlpha(0);
}, 1500);




