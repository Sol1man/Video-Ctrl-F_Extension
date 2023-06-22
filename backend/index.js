const express = require('express')
const ytdl = require('ytdl-core')
const fs = require('fs')
const { exec } = require('child_process')
const cors = require('cors')

const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
}

const app = express()

app.use(cors())
app.use(requestLogger)

app.get('/', (req, res) => {
    res.json({
        "Hello": ["00:01", "00:40"],
        "World": ["01:22", "02:11"]
    })
})

app.get('/fetch', (req, res) => {
    const url = req.query.url

    res.header('Content-Disposition', 'attachment; filename="video.mp4"')
    ytdl(url, {
        format: 'mp4'
    }).pipe(fs.createWriteStream('../../Video-Ctrl-F/data/video.mp4'))

    exec('conda run -n GP python ../../Video-Ctrl-F/src/main.py ../data/video.mp4',
        (error, stdout, stderr) => {
        if (error) {
            console.log(`Error: ${error}`)
            return
        }
        
        console.log(`Stdout: ${stdout}`)
        console.log(`Stderr: ${stderr}`)
    })

    console.log(`Video downloaded: ${url}`)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})