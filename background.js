chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log("From background");
    // const src = request["url"];
    // const xhr = new XMLHttpRequest();

    // xhr.open("GET", "http://127.0.0.1:5000/");
    // xhr.send(JSON.stringify({
    //     "url": `${src}`
    // }));
    // xhr.responseType = "json";
    // xhr.onload = () => {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //         console.log("response: ", xhr.response);
    //         sendResponse(xhr.response)
    //     } else {
    //         console.log("Error");
    //         sendResponse("Error");
    //     }
    // }
    const response = await fetch("http://127.0.0.1:5000/");
    console.log(response.statusText);
    // return true;
});
