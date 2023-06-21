console.log("popup loaded");

const sendReqButton = document.getElementById('send_req')
let data = null;

(function() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
        const tab = tabs[0]
        chrome.storage.local.get([tab.url]).then(result => {
            if (!Object.values(result)[0]) {
                return
            }

            data = Object.values(result)[0]
            console.log('Data retrieved in popup:', data)
            sendReqButton.setAttribute('disabled', '')
        })
        .catch(error => {
            console.log('Error:', error)
        })
    })
})()

sendReqButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({}).then(response => {
        sendReqButton.setAttribute('disabled', '')
        console.log(response)

        chrome.storage.local.get([response.TabURL]).then(result => {
            console.log('Result from local storage:', result)
        })
    })
})