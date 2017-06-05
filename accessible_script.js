
var adsDebug = {
    runDebugAds: false,
    listScript: [],
    enable: false,
    init: function () {

        if(this.runDebugAds) return;

        let style = document.createElement("style");
        style.innerHTML = `
        .debugAds .dimentions{
            font-size: 13px;
            margin: 7px;
        }
        .debugAds {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 65, 54, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: monospace;
            flex-direction: column;
            color: #FFF;
            font-size: 85%;
            text-shadow: 2px 3px 2px #000;
            font-weight: 700;
            border-radius: 2px;
            border: 2px dashed #000;
            z-index: 1000;
            animation: 0.5s animateBorderOne ease-out infinite;
        }

        @keyframes animateBorderOne {
          to {
            border-radius: 5px
          }
        }

        .wrapDebugAds{
            min-width: 100%;
            min-height: 45px;
            position: relative;
        }
    `;

        let head = document.getElementsByTagName("head")[0];
        head.appendChild(style);

        this.enabled();

        this.runDebugAds = true;
    },
    enabled: function () {
        this.listScript = [].slice.call(document.querySelectorAll("script:not([src]")).filter((script) => {
            if (script.innerHTML.trim().indexOf("eplAD4M") == 0) {

                let list_eplAD4M = script.innerHTML.match(/(\w+)/g);
                script.label = list_eplAD4M[1];

                if(list_eplAD4M.length == 2){
                    var $epl = document.getElementById("eplAdDiv" + script.label);
                }else if( list_eplAD4M.length == 3 ){
                    let device = navigator.appVersion.indexOf("Mobile") == -1 ? "d": "m";
                    if( device == list_eplAD4M[2])
                        var $epl = document.getElementById("eplAdDiv" + script.label);
                }

                if (!$epl) return;

                $epl.classList.add("wrapDebugAds");

                let debug = this.createDebug(script);
                $epl.insertBefore(debug, $epl.firstElementChild);
                var rects = debug.getClientRects();

                if( rects.length == 0){
                    console.log('ads oculto de nombre '+ script.label );
                    return;
                }

                $epl.debug = debug;
                script.epl = $epl;

                debug.setDimentions();

                return true;
            }
        });
        this.enable = true;
    },
    disabled : function(){
        this.listScript.forEach(function (script) {
            script.epl.classList.remove("wrapDebugAds");
            script.epl.debug.remove();
        })
        this.enable = false;
    },
    createDebug: function (script) {
        var div = document.createElement("div");
        var divDimentions = document.createElement("div");
        var divName = document.createElement("div");
        var sec = window.eplArgs.sec;
        var section = sec == "" ? "" : " / " + window.eplArgs.sec;
        divName.innerHTML = script.label + section;

        divDimentions.classList.add("dimentions");

        div.setDimentions = function () {
            let rect = this.getClientRects()[0];
            divDimentions.innerHTML = Math.floor(rect.width) + " X " + Math.floor(rect.height);
        };

        div.classList.add("debugAds");
        div.appendChild(divName);
        div.appendChild(divDimentions);

        return div;
    }
};

adsDebug.init();