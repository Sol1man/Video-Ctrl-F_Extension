console.log("popup loaded");

const sendReqButton = document.getElementById('start-button')
const searchBar = document.getElementById('search-bar')
const searchButton = document.getElementById('search-button')
const outputArea = document.getElementsByClassName('output')[0]
const loader = document.getElementsByClassName('loader')[0]

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
            loader.remove()

            data = Object.values(result)[0]
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
    const softIntersection = (initArr, arrays) => {
        if (arrays.length === 0) {
          return initArr
        }
      
        const intersection = initArr.filter(v => arrays[0].includes(v))
        const newInit = intersection.length === 0 ? initArr : intersection
        arrays.shift()
        return softIntersection(newInit, arrays)
    }
      
    const searchWords = searchBar.value.toLowerCase().trim().match(/\w+/g)
    const secsArr = searchWords.map(word => {
        if (Object.keys(data).includes(word)) {
            return data[word]
        } else {
            return []
        }
    })

    const initArr = secsArr[0]
    secsArr.shift()
    const intersection = softIntersection(initArr, secsArr)

    const tr = document.createElement('tr')
    tbody.appendChild(tr)

    const sortedSecs = intersection.sort((a, b) => a - b)
    sortedSecs.forEach(secs => {
        const timestamp = secToTimestamp(secs)
        const td = document.createElement('td')
        const a = document.createElement('a')
        const textNode = document.createTextNode(timestamp)
        a.appendChild(textNode)

        a.setAttribute('href', `https://www.youtube.com/watch?v=${videoId}&t=${timestampToText(timestamp)}`)
        a.addEventListener('click', event => {
            event.preventDefault()

            chrome.runtime.sendMessage({
                secs
            })
        })

        td.appendChild(a)
        tr.appendChild(td)
    })
})

searchBar.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        event.preventDefault()
        searchButton.click()
    }
})

sendReqButton.addEventListener('click', () => {
    loader.style.visibility = 'visible'
    chrome.runtime.sendMessage({}).then(response => {
        loader.remove()
        sendReqButton.setAttribute('disabled', '')
        console.log('Response from background: ', response)

        data = JSON.parse(response.content)

        chrome.storage.session.set({ [response.ytId]: JSON.parse(response.content) })
        console.log('Data: ', data)
    })
})