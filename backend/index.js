const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.get('/', (req, res) => {
    console.log("alooooo")
    res.json({
        "Hello": ["00:01", "00:40"],
        "World": ["01:22", "02:11"]
    })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})