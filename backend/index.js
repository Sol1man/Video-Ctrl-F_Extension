require('dotenv').config()
const assert = require('assert')
const express = require('express')
const ytdl = require('ytdl-core')
const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const cors = require('cors')
const Video = require('./models/video')

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

app.get('/fetch', async (req, res, next) => {
    const ytId = req.query.ytId

    assert(ytId.length === 11)

    const foundVideo = await Video.findOne({ ytId })

    if (foundVideo) {
        console.log('Found video in DB')
        res.json(foundVideo)
        return
    }

    const url = `https://www.youtube.com/watch?v=${ytId}`
    ytdl.getInfo(url)
        .then(async (_result) => {
            res.header('Content-Disposition', 'attachment; filename="video.mp4"')
            ytdl(url, {
                format: 'mp4',
                filter: 'audioandvideo'
            }).pipe(fs.createWriteStream('../../Video-Ctrl-F/data/video.mp4'))
            console.log(`Video downloaded: ${url}`)

            await exec('conda run -n GP python ../../Video-Ctrl-F/src/main.py ../../Video-Ctrl-F/data/video.mp4',
                (error, stdout, stderr) => {
                if (error) {
                    console.log(`Error: ${error}`)
                    return res.status(500).end()
                }
                
                console.log(`Stdout: ${stdout}`)
                console.log(`Stderr: ${stderr}`)
        
                console.log('Finished video processing')
        
                fs.readFile('../dump/video/dict_index.json', (error, data) => {
                    console.log('Reading JSON file')
                    if (error) {
                        console.log('Error reading json file: ', error)
                        return res.status(500).end()
                    }
        
                    const video = new Video({
                        ytId,
                        content: JSON.stringify(JSON.parse(data))
                    })
            
                    video.save().then(savedVideo => {
                        res.json(savedVideo.content)
                        console.log('Added video to database: ', savedVideo.ytId)
                    })
                })
            })
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.message === 'Video unavailable') {
        return response.status(400).json({ error: 'Please enter a valid video ID' })
    }
    next()
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})