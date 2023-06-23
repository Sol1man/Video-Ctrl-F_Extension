const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url).then(() => {
  console.log('Connected to MongoDB')
}).catch(error => {
  console.log('Error: ', error)
})

const videoSchema = new mongoose.Schema({
  ytId: String,
  content: String,
  metadata: String
})

videoSchema.set('toJSON', {
  transform: (docuemnt, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Video', videoSchema)