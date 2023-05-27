console.log("background loaded")

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("From background", message);
    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(function (tabs) {
        const tab = tabs[0];
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        const videoURL = urlParameters.get("v");

        console.log(videoURL);
        fetch("http://127.0.0.1:5000/").then(function (response) {
            return response.json();
        }).then(function (data) {
            sendResponse(data);
        });
    });

    return true;
});
