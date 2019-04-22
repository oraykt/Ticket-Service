const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TicketSchema = new Schema({
  ticketPrice: {
    type: Number,
    required: true
  },
  soldTickets: {
    type: Number,
    default: 0,
    min: 0
  },
  totalTickets: {
    type: Number,
    required: [true, 'You must define totalTickets!']
  }
})

module.exports = mongoose.model('ticket', TicketSchema)
