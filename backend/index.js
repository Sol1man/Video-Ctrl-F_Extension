const express = require('express')
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})