/**
 * Created by Waldo J. Saccaco (w.saccaco@gmail.com) on 31/03/2017.
 */

function injectScript(url_script) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(url_script);

    (document.head||document.documentElement).appendChild(s);

    s.onload = function() {
        s.parentNode.removeChild(s);
    };
}


if(typeof activeAds != "boolean"){
    injectScript('accessible_script.js');
    var activeAds = true;
    var enabled = true;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    console.log(request.TYPE);
    if (request.TYPE == "undefined") return;

    switch (request.TYPE) {
        case "debugAds":
            if (!enabled) {
                injectScript('toggle.js');
                sendResponse({response: "enabled"});
            } else {
                injectScript('toggle.js');
                sendResponse({response: "disabled"});
            }
            enabled = !enabled;
            break;
        case "getStatus":
            sendResponse({response: enabled ? "enabled" : "disabled"});
            break;
    }

});