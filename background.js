console.log("background loaded")
let data = null

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("From background", message);
    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
        const tab = tabs[0];
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        const videoURL = urlParameters.get("v");
        console.log(videoURL);
        fetch("http://localhost:3001/")
            .then(response => {
                return response.json()
            })
            .then(data => {
                chrome.storage.local.set({ [tab.url]: data })
                sendResponse({ "TabURL": tab.url })
            })
    });

    return true;
});