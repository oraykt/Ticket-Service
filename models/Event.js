const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  ticketId: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, { versionKey: false })

module.exports = mongoose.model('event', EventSchema)
