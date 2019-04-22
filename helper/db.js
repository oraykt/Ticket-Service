const mongoose = require('mongoose')

module.exports = () => {
  mongoose.connect('mongodb+srv://testuser:testpassword@cluster0-t6vth.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
  mongoose.set('useCreateIndex', true)

  mongoose.connection.on('open', () => {
    console.log('MongoDB: Connected!')
  })
  mongoose.connection.on('error', (error) => {
    console.log('MongoDB: Connection Failed! \n', error)
  })

  mongoose.Promise = global.Promise
}
