console.log("background loaded")
let data = null

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("From background", message);
    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
        const tab = tabs[0];
        if (message.secs) {
            chrome.tabs.sendMessage(tab.id, { secs: message.secs })
            return
        }
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        const videoURL = urlParameters.get("v");
        console.log(videoURL);
        console.log(tab.url)
        fetch(`http://localhost:3001/fetch?ytId=${videoURL}`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                sendResponse(data)
            })
    });

    return true;
});