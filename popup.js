console.log("popup loaded");
(async () => {
    const response = await chrome.runtime.sendMessage({});
    console.log("response from popup: ", response);


    // document.getElementsByTagName()
    // ...etc
})();