const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookingTicketSchema = new Schema({
  ticketId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  ticketAmount: {
    type: Number,
    required: true
  },
  ticketPrice: {
    type: Number,
    required: [true, 'You must define ticketPrice!']
  },
  status: {
    type: Boolean,
    required: true
  }
}, { versionKey: false })

module.exports = mongoose.model('bookingTicket', BookingTicketSchema)
