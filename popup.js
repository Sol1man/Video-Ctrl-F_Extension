console.log("popup loaded");

const sendReqButton = document.getElementById('send-req')
const searchBar = document.getElementById('search-bar')
const searchButton = document.getElementById('button-addon2')

const secToTimestamp = totalSeconds => {
    const hours = Math.floor(totalSeconds / (60  * 60)).toString().padStart(2, 0)
    const minutes = Math.floor((totalSeconds - (hours * 60 * 60)) / 60).toString().padStart(2, 0)
    const seconds = (totalSeconds - ((hours * 60 * 60) + (minutes * 60))).toString().padStart(2, 0)


    return `${hours}:${minutes}:${seconds}`
}

const timestampToText = timestamp => {
    const [hours, minutes, secs] = timestamp.split(':')
    return `${hours}h${minutes}m${secs}s`
}

let data = {};
let videoId = null;

(function () {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
        const tab = tabs[0];
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        const videoURL = urlParameters.get("v");
        videoId = videoURL

        chrome.storage.session.get([videoURL]).then(result => {
            if (!Object.values(result)[0]) return

            data = Object.values(result)[0][0]
            console.log('Found data in session: ', data)
            sendReqButton.setAttribute('disabled', '')
        })
    })
})();

//TODO: search algorithm <3 :) ::::)

searchButton.addEventListener('click', () => {
    if (!data) {
        return
    }

    const tbody = document.getElementById('t-body')
    if (tbody.childNodes[0]) {
        tbody.childNodes[0].remove()
    }

    // <td><a href="youtube.com/watch?v=${url}&t=${timestamp}"</a></td>
    
    if (Object.keys(data).includes(searchBar.value)) {
        console.log(searchBar.value)
        const tr = document.createElement('tr')
        tbody.appendChild(tr)
        console.log(data[searchBar.value])
        data[searchBar.value].forEach(timestamp => {
            const td = document.createElement('td')
            const a = document.createElement('a')
            const textNode = document.createTextNode(timestamp)
            a.appendChild(textNode)
            a.setAttribute('href', `https://www.youtube.com/watch?v=${videoId}&t=${timestampToText(timestamp)}`)
            a.setAttribute('target', '_parent')
            td.appendChild(a)
            tr.appendChild(td)
        })
    }

})

sendReqButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({}).then(response => {
        sendReqButton.setAttribute('disabled', '')
        console.log('Response from background: ', response)

        const parsedResponse = JSON.parse(response.content)
        Object.keys(parsedResponse).forEach(word => {
            data[word] = parsedResponse[word].map(secs => secToTimestamp(secs))
        })

        chrome.storage.session.set({ [response.ytId]: [data] })
        console.log('Data: ', data)
    })
})