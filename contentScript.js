// (async () => {
//     const response = await chrome.runtime.sendMessage({});
//     console.log("response from content script: ", response);
// })();
// const videoElement = document.querySelector('video');
// videoElement.currentTime = 60; // Seek to 60 seconds

chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.secs) {
    const videoElement = document.querySelector('video')
    videoElement.currentTime = message.secs
  }
})