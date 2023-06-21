// In popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.data) {
        console.log(message.data)
    }

    console.log('From script.js <3')
});