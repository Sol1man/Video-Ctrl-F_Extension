console.log("popup loaded");

const sendReqButton = document.getElementById('send-req')
const searchBar = document.getElementById('search-bar')
const searchButton = document.getElementById('button-addon2')
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
})();

searchButton.addEventListener('click', () => {
    if (!data) {
        return
    }

    const tbody = document.getElementById('t-body')
    tbody.childNodes[0].remove()
    
    if (Object.keys(data).includes(searchBar.value)) {
        console.log(searchBar.value)
        const tr = document.createElement('tr')
        tbody.appendChild(tr)
        console.log(data[searchBar.value])
        data[searchBar.value].forEach(timestamp => {
            const td = document.createElement('td')
            const textNode = document.createTextNode(timestamp)
            td.appendChild(textNode)
            tr.appendChild(td)
        })
    }

})

sendReqButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({}).then(response => {
        sendReqButton.setAttribute('disabled', '')
        console.log(response)

        chrome.storage.local.get([response.TabURL]).then(result => {
            console.log('Result from local storage:', result)
        })
    })
})