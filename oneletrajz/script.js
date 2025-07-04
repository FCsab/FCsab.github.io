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
       var greeting = "ÉLETRAJZ PROTOKOLL INICIALIZÁLVA";
       var message = "FARAGÓ CSABA PROFIL BETÖLTÉSE FOLYAMATBAN...";
       var $identityDiv = $("#identity-results");
       var $name = "NÉV: FARAGÓ CSABA";
       var $alias = "ELÉRHETŐSÉG: CSABI@CSABI.ZIP | +36 70 336 7014"
       var $occupation  = "POZÍCIÓ: SZOFTVERFEJLESZTŐ HALLGATÓ | BUDAPEST IV.";
       var $frontEnd  = "TANULMÁNYOK: BUDAPESTI MŰSZAKI SZC EGRESSY GÁBOR TECHNIKUM";
         var $JSFrameworks = "SZAK: SZOFTVERFEJLESZTŐ (2020 - JELENLEG)";
         var $JSLibs = "VÁRHATÓ BEFEJEZÉS: 2025 - SZAKMAI ÉRETTSÉGI ÉS GYAKORLATI ÉV";
         var $CSSFrameworks = "SZÜLETÉSI DÁTUM: 2005.02.02";
         var $CSSPre = "ANGOL NYELVTUDÁS: MAGAS SZINTŰ (C1)";
         var $frontEndAnimation = "LINUX RENDSZERISMERET: 2+ ÉV TAPASZTALAT";
       var $cmsDevelopment = "KÉPESSÉGEK: DIGITÁLIS JÁRTASSÁG ÉS GYORS TANULÁS";
         var $wordpress = "KOMMUNIKÁCIÓ: KIVÁLÓ SZÓBELI ÉS ÍRÁSBELI KÉSZSÉGEK";
       var $design = "MOTIVÁCIÓ: TAPASZTALATSZERZÉS ÉS TUDÁSFELHASZNÁLÁS";
         var $webDesign = "CSAPATMUNKA: MAGABIZTOSAN HELYTÁLLOK EGYÉNI ÉS CSOPORTOS MUNKÁBAN";
         var $branding = "SZABADIDŐ: PROGRAMOZÁS ÉS ROBOTIKA TANULÁS";
         var $designAnimation = "TOVÁBBI INFO: RENDSZERES SPORT, JÓ FIZIKAI ÁLLÓKÉPESSÉG";
         
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


