/* eslint-disable no-return-await */
/* eslint-disable no-unused-vars */
const Event = require('../models/Event')
const Ticket = require('../models/Ticket')
const BookingTicket = require('../models/BookingTicket')
const paymentGateway = require('./paymentGateway')
const typeChecker = require('../utils/typeChecker')

const refactorService = {
  bookTicket: async (params) => {
    // TODO ticketAmount + availableTickets(ticketAmount)
    typeChecker.ticketAmount(params.ticketAmount)
    return await Ticket.findById(params.ticketId).then(async (ticketDetail) => {
      if (!ticketDetail) {
        throw new Error('ticketId not found!')
      }
      typeChecker.availableTickets(params.ticketAmount, ticketDetail)
      return await paymentGateway.charge(params.ticketAmount * ticketDetail.ticketPrice, params.token)
        .then(async ({ amount, curreny }) => {
          ticketDetail.soldTickets += params.ticketAmount
          return await Ticket.findByIdAndUpdate(ticketDetail._id, ticketDetail).then(async (updatedTicket) => {
            return await new BookingTicket({
              ticketId: ticketDetail._id,
              ticketAmount: params.ticketAmount,
              ticketPrice: ticketDetail.ticketPrice,
              status: true
            }).then(async (bookedTicket) => {
              return await {
                information: 'Thank you!',
                bookTicketAction: true,
                bookedTicketDetail: bookedTicket
              }
            })
          })
        }).catch(async (error) => {
          return await new BookingTicket({
            ticketId: ticketDetail._id,
            ticketAmount: params.ticketAmount,
            ticketPrice: ticketDetail.ticketPrice,
            status: false
          }).save().then(async (bookedTicket) => {
            return await {
              error: error.message,
              information: 'Tickets are reserved for you in 15 minutes.',
              bookTicketAction: false,
              bookedTicketDetail: bookedTicket
            }
          })
        })
    }).catch((error) => {
      throw error
    })
  }
}

module.exports = refactorService
