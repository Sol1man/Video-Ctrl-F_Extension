console.log("background loaded")
let testBack = 0
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("From background", message);
    testBack = testBack + 1
    console.log("Abdo Omar", testBack)
    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(function (tabs) {
        const tab = tabs[0];
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        const videoURL = urlParameters.get("v");
        console.log(videoURL);
        fetch("http://localhost:3001/").then(function (response) {
            return response.json();
        }).then(function (data) {
            sendResponse(data);
        });
    });

    return true;
});
