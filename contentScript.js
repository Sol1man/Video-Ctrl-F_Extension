const video = document.getElementsByTagName("video")[0];
if (video) {
    console.log(video.getAttribute("src"));
    const src = video.getAttribute("src");
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "http://127.0.0.1:5000/");
    xhr.send(JSON.stringify({
        "url": `${src}`
    }));
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.response);
        } else {
            console.log("Error");
        }
    }
}