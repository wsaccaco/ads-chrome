let textDebug = {
    enabled: "Habilitar Debug",
    disabled: "Deshabilitar Debug"
};

function sendMessage( params, callback){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        chrome.tabs.sendMessage(tabs[0].id, params, function(ObjectResponse){
            callback(ObjectResponse)
        });

        chrome.tabs.get(tabs[0].id, function(tab){
            console.log(tab.windowId);
            chrome.windows.get(tab.windowId, function(win){
                console.log(win); // THIS IS THE WINDOW OBJECT
            });
        });

    })
}

function binding($btnToggle){

    $btnToggle.addEventListener("click", function () {
        sendMessage({TYPE: "debugAds"}, function (object) {
            let status = object.response;
            changeText($btnToggle, status);

        })
    })
}

function changeText($btnToggle, status){
    switch (status){
        case "enabled":
            $btnToggle.innerHTML = textDebug.disabled;
            break;
        case "disabled":
            $btnToggle.innerHTML = textDebug.enabled;
            break;
        default:
            break;
    }
}

document.addEventListener('DOMContentLoaded', function () {

    let $btnToggle = document.querySelector("#toggle");

    chrome.tabs.executeScript(null, {file: "script.js"});

    sendMessage({TYPE: "getStatus"}, function (object) {
        changeText($btnToggle, object.response);
    });

    binding($btnToggle);

});

