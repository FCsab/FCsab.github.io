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
   
   var initProgram = setTimeout(function(){
       var greeting = "ÉLETRAJZ PROTOKOLL SIKERESEN INICIALIZÁLVA";
       var message = "FARAGÓ CSABA SZEMÉLYES ADATAINAK BETÖLTÉSE FOLYAMATBAN...";
       var $identityDiv = $("#identity-results");
       var $name = "NÉV: FARAGÓ CSABA";
       var $alias = "ELÉRHETŐSÉG: CSABI@CSABI.ZIP | TELEFON: +36 70 336 7014"
       var $occupation  = "JELENLEGI POZÍCIÓ: SZOFTVERFEJLESZTŐ HALLGATÓ | BUDAPEST IV. KERÜLET";
       var $frontEnd  = "TANULMÁNYOK: BUDAPESTI MŰSZAKI SZAKKÉPZÉSI CENTRUM EGRESSY GÁBOR TECHNIKUM";
         var $JSFrameworks = "SZAKMA: SZOFTVERFEJLESZTŐ ÉS -TESZTELŐ (2020 - FOLYAMATBAN)";
         var $JSLibs = "VÁRHATÓ BEFEJEZÉS: 2025 - SZAKMAI ÉRETTSÉGI ÉS SZAKMAI GYAKORLAT";
         var $CSSFrameworks = "SZÜLETÉSI DÁTUM: 2005. FEBRUÁR 2.";
         var $CSSPre = "ANGOL NYELVISMERET: MAGAS SZINTŰ (C1 SZINT)";
         var $frontEndAnimation = "LINUX RENDSZERISMERET: MINDENNAPI HASZNÁLAT ÉS SZERVER ADMINISZTRÁCIÓ (DEBIAN, FEDORA, ARCH)";
         var $windowsKnowledge = "WINDOWS RENDSZERISMERET: MAGAS SZINTŰ OPERÁCIÓS RENDSZER ISMERETEK";
         var $programming = "PROGRAMOZÁSI NYELVEK ÉS TECHNOLÓGIÁK: PYTHON, GO, HTML, CSS, JAVASCRIPT, C++, C#, DOCKER";
         var $cad3d = "3D TERVEZÉSI ISMERETEK: 1 ÉV TAPASZTALAT (SOLID EDGE, FUSION360)";
         var $microcontroller = "MIKROKONTROLLER PROGRAMOZÁS: ESP32 FEJLESZTÉSI KÖRNYEZET";
         var $hardwareMaintenance = "HARDVER ISMERETEK: SZÁMÍTÓGÉP SZERELÉS ÉS KARBANTARTÁS";
         var $networking = "HÁLÓZATI ISMERETEK: 1 ÉV ELMÉLETI ÉS GYAKORLATI TANULMÁNYOK";
       var $cmsDevelopment = "SZEMÉLYES KOMPETENCIÁK: MAGAS SZINTŰ DIGITÁLIS JÁRTASSÁG ÉS GYORS TANULÁSI KÉSZSÉG";
         var $wordpress = "KOMMUNIKÁCIÓS KÉSZSÉGEK: KIVÁLÓ SZÓBELI ÉS ÍRÁSBELI KOMMUNIKÁCIÓ";
       var $design = "MOTIVÁCIÓ ÉS CÉLOK: SZAKMAI TAPASZTALATSZERZÉS ÉS TUDÁS GYAKORLATI ALKALMAZÁSA";
         var $webDesign = "CSAPATMUNKA: MAGABIZTOS TELJESÍTMÉNY EGYÉNI ÉS CSOPORTOS PROJEKTEKBEN";
         var $branding = "SZABADIDŐS TEVÉKENYSÉGEK: PROGRAMOZÁSI PROJEKTEK ÉS ROBOTIKAI KÍSÉRLETEK";
         var $designAnimation = "KIEGÉSZÍTŐ INFORMÁCIÓK: RENDSZERES SPORTOLÁS, KIVÁLÓ FIZIKAI ÁLLAPOT";
         
      function initIdentityResults(i){
          $("#message").addClass("sign cursor").text(message.substring(0, i));
            if(i < message.length){
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
                  $("#name").addClass("sign cursor").text($name.substring(0, i));
                     if(i < $name.length){
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
                  $("#alias").addClass("sign cursor").text($alias.substring(0, i));
                     if(i < $alias.length){
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
               $("#occupation").addClass("sign cursor").text($occupation.substring(0, i));
                     if(i < $occupation.length){
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
               $('#front-end-span').addClass('fa fa-graduation-cap');
               $('#front-end').addClass("cursor").text($frontEnd.substring(0, i));
                  if(i < $frontEnd.length){
                     setTimeout(function(){
                        initFrontEnd(i + 1);  
                     }, 15);
                  }else{
                     $('#front-end').removeClass("cursor");
                        setTimeout(function() {
                           initJSFrameworks(0);
                        }, 500);
                  }
            }
            function initJSFrameworks(i){
               $('#js-frameworks').addClass("sign cursor").text($JSFrameworks.substring(0, i));
                  if(i < $JSFrameworks.length){
                     setTimeout(function(){
                         initJSFrameworks(i + 1);  
                     }, 15);
                  }else{
                     $('#js-frameworks').removeClass("cursor");
                        setTimeout(function() {
                           initJSLibs(0);
                        }, 500);
                  }
            }
            function initJSLibs(i){
               $('#js-libs').addClass("sign cursor").text($JSLibs.substring(0, i));
                  if(i < $JSLibs.length){
                     setTimeout(function(){
                         initJSLibs(i + 1);  
                     }, 15);
                  }else{
                     $('#js-libs').removeClass("cursor");
                        setTimeout(function() {
                           initCSSFrameworks(0);
                        }, 500);
                  }
            }
            function initCSSFrameworks(i){
               $('#css-frameworks').addClass("sign cursor").text($CSSFrameworks.substring(0, i));
                  if(i < $CSSFrameworks.length){
                     setTimeout(function(){
                         initCSSFrameworks(i + 1);  
                     }, 15);
                  }else{
                     $('#css-frameworks').removeClass("cursor");
                     setTimeout(function() {
                           initCSSPre(0);
                        }, 500);
                  }
            }
             function initCSSPre(i){
               $('#css-pre').addClass("sign cursor").text($CSSPre.substring(0, i));
                  if(i < $CSSPre.length){
                     setTimeout(function(){
                         initCSSPre(i + 1);  
                     }, 15);
                  }else{
                     $('#css-pre').removeClass("cursor");
                     setTimeout(function() {
                           initFrontEndAnimation(0);
                        }, 500);
                  }
            }
            function initFrontEndAnimation(i){
               $('#front-end-animation').addClass("sign cursor").text($frontEndAnimation.substring(0, i));
                  if(i < $frontEndAnimation.length){
                     setTimeout(function(){
                         initFrontEndAnimation(i + 1);  
                     }, 15);
                  }else{
                     $('#front-end-animation').removeClass("cursor");
                     setTimeout(function() {
                           initWindowsKnowledge(0);
                        }, 500);
                  }
            }
            function initWindowsKnowledge(i){
               $('#windows-knowledge').addClass("sign cursor").text($windowsKnowledge.substring(0, i));
                  if(i < $windowsKnowledge.length){
                     setTimeout(function(){
                         initWindowsKnowledge(i + 1);  
                     }, 15);
                  }else{
                     $('#windows-knowledge').removeClass("cursor");
                     setTimeout(function() {
                           initProgramming(0);
                        }, 500);
                  }
            }
            function initProgramming(i){
               $('#programming').addClass("sign cursor").text($programming.substring(0, i));
                  if(i < $programming.length){
                     setTimeout(function(){
                         initProgramming(i + 1);  
                     }, 15);
                  }else{
                     $('#programming').removeClass("cursor");
                     setTimeout(function() {
                           initCad3d(0);
                        }, 500);
                  }
            }
            function initCad3d(i){
               $('#cad-3d').addClass("sign cursor").text($cad3d.substring(0, i));
                  if(i < $cad3d.length){
                     setTimeout(function(){
                         initCad3d(i + 1);  
                     }, 15);
                  }else{
                     $('#cad-3d').removeClass("cursor");
                     setTimeout(function() {
                           initMicrocontroller(0);
                        }, 500);
                  }
            }
            function initMicrocontroller(i){
               $('#microcontroller').addClass("sign cursor").text($microcontroller.substring(0, i));
                  if(i < $microcontroller.length){
                     setTimeout(function(){
                         initMicrocontroller(i + 1);  
                     }, 15);
                  }else{
                     $('#microcontroller').removeClass("cursor");
                     setTimeout(function() {
                           initHardwareMaintenance(0);
                        }, 500);
                  }
            }
            function initHardwareMaintenance(i){
               $('#hardware-maintenance').addClass("sign cursor").text($hardwareMaintenance.substring(0, i));
                  if(i < $hardwareMaintenance.length){
                     setTimeout(function(){
                         initHardwareMaintenance(i + 1);  
                     }, 15);
                  }else{
                     $('#hardware-maintenance').removeClass("cursor");
                     setTimeout(function() {
                           initNetworking(0);
                        }, 500);
                  }
            }
            function initNetworking(i){
               $('#networking').addClass("sign cursor").text($networking.substring(0, i));
                  if(i < $networking.length){
                     setTimeout(function(){
                         initNetworking(i + 1);  
                     }, 15);
                  }else{
                     $('#networking').removeClass("cursor");
                     setTimeout(function() {
                           initCMSDevelopment(0);
                        }, 500);
                  }
            }
            function initCMSDevelopment(i){
               $('#cms-span').addClass("fa fa-cogs")
               $('#CMS-development').addClass("cursor").text($cmsDevelopment.substring(0, i));
                  if(i < $cmsDevelopment.length){
                     setTimeout(function(){
                         initCMSDevelopment(i + 1);  
                     }, 15);
                  }else{
                     $('#CMS-development').removeClass("cursor");
                     setTimeout(function() {
                           initWordpress(0);
                        }, 500);
                  }
            }
            function initWordpress(i){
               $('#wordpress').addClass("sign cursor").text($wordpress.substring(0, i));
                  if(i < $wordpress.length){
                     setTimeout(function(){
                         initWordpress(i + 1);  
                     }, 15);
                  }else{
                     $('#wordpress').removeClass("cursor");
                     setTimeout(function() {
                           initDesign(0);
                        }, 500);
                  }
            }
             function initDesign(i){
               $('#design-span').addClass('fa fa-user');
               $('#design').addClass("cursor").text($design.substring(0, i));
                  if(i < $design.length){
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
               $('#web-design').addClass("sign cursor").text($webDesign.substring(0, i));
                  if(i < $webDesign.length){
                     setTimeout(function(){
                         initWebDesign(i + 1);  
                     }, 35);
                  }else{
                     $('#web-design').removeClass("cursor");
                     setTimeout(function() {
                           initBranding(0);
                        }, 500);
                  }
            }
            function initBranding(i){
               $('#branding').addClass("sign cursor").text($branding.substring(0, i));
                  if(i < $branding.length){
                     setTimeout(function(){
                         initBranding(i + 1);  
                     }, 35);
                  }else{
                     $('#branding').removeClass("cursor");
                     setTimeout(function() {
                           initDesignAnimation(0);
                        }, 500);
                  }
            }
            function initDesignAnimation(i){
               $('#design-animation').addClass("sign cursor").text($designAnimation.substring(0, i));
                  if(i < $designAnimation.length){
                     setTimeout(function(){
                         initDesignAnimation(i + 1);  
                     }, 35);
                  }else{
                     //$('#design-animation').removeClass("cursor");
                  }
            }
         }
         
      function initProgramAlpha(i){
          $("#greeting").addClass("cursor").text(greeting.substring(0, i));
            if(i < greeting.length){
                setTimeout(function(){
                    initProgramAlpha(i + 1);
                }, 35);   
            }else{
               $("#greeting").removeClass("cursor");
               initIdentityResults(0);
            }
         }
         initProgramAlpha(0)
   
   }, 1500);

initProgram()


