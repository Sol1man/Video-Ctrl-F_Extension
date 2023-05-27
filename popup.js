document.addEventListener("DOMContentLoaded", async () => {
    console.log("popup loaded");
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //     console.log("From popup");
    //     const activeTab = tabs[0];
    //     const message = {
    //         message: "popup"
    //     };
    //     chrome.tabs.sendMessage(activeTab.id, message, (response) => {
    //         console.log("Response from content script:", response);
    //     });
    // })
});
