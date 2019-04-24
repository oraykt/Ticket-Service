const BookedTicket = require('../models/BookingTicket')
const Ticket = require('../models/Ticket')
module.exports = (bookingId) => {
  setTimeout(() => {
    BookedTicket.findById(bookingId).then((bookedTicket) => {
      if (!bookedTicket.status) {
        BookedTicket.findByIdAndDelete(bookingId).then((reservedTicket) => {
          Ticket.findById(reservedTicket.ticketId).then((ticket) => {
            ticket.soldTickets -= reservedTicket.ticketAmount
            Ticket.findByIdAndUpdate(ticket._id, ticket).then(() => {
              console.log(`${reservedTicket._id} removed!`)
            })
          })
        })
      } else {
        console.log(`${bookedTicket._id} confirmed!`)
      }
    }).catch((error) => {
      throw error
    })
  }, 1000 * 60 * 15)
}
