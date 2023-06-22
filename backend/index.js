require('dotenv').config()
const express = require('express')
const ytdl = require('ytdl-core')
const mongoose = require('mongoose')
const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const cors = require('cors')

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB')
})

const videoSchema = new mongoose.Schema({
    ytId: String,
    content: String
})

const Video = mongoose.model('Video', videoSchema)

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

app.get('/fetch', async (req, res) => {
    const url = req.query.url

    const id = url.split('?v=')[1]
    Video.findOne({ ytId: id }).then(video => {
        if (video) {
            console.log('Found video in DB: ', video.content)
            res.json(video.content)
        }
    })

    res.header('Content-Disposition', 'attachment; filename="video.mp4"')
    ytdl(url, {
        format: 'mp4'
    }).pipe(fs.createWriteStream('../../Video-Ctrl-F/data/video.mp4'))
    console.log(`Video downloaded: ${url}`)

    await exec('conda run -n GP python ../../Video-Ctrl-F/src/main.py ../../Video-Ctrl-F/data/video.mp4',
        (error, stdout, stderr) => {
        if (error) {
            console.log(`Error: ${error}`)
            res.status(500).end()
        }
        
        console.log(`Stdout: ${stdout}`)
        console.log(`Stderr: ${stderr}`)

        console.log('Finished video processing :::)')
    
        fs.readFile('../dump/video/dict_index.json', (error, data) => {
            console.log('Reading JSON file ::(')
            if (error) {
                console.log('Error reading json file: ', error)
                res.status(500).end()
            }
    
            const video = new Video({
                ytId: id,
                content: JSON.stringify(JSON.parse(data))
            })
    
            video.save().then(savedVideo => {
                res.json(savedVideo.content)
                console.log('Added video to database: ', savedVideo.ytId)
            })
        })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})