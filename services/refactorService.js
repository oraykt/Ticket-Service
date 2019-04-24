/* eslint-disable no-return-await */
/* eslint-disable no-unused-vars */
const Event = require('../models/Event')
const Ticket = require('../models/Ticket')
const BookingTicket = require('../models/BookingTicket')
const paymentGateway = require('./paymentGateway')
const typeChecker = require('../utils/typeChecker')
const bookingHandler = require('../utils/bookingHandler')
const refactorService = {
  bookTicket: async (params) => {
    // TODO ticketAmount + availableTickets(ticketAmount)
    typeChecker.ticketAmount(params.ticketAmount)
    return await Ticket.findById(params.ticketId).then(async (ticketDetail) => {
      if (!ticketDetail) {
        throw new Error('ticketId not found!')
      }
      typeChecker.availableTickets(params.ticketAmount, ticketDetail)
      ticketDetail.soldTickets += params.ticketAmount
      return await Ticket.findByIdAndUpdate(ticketDetail._id, ticketDetail, { new: true })
        .then(async (updatedTicket) => {
          return await paymentGateway.charge(params.ticketAmount * ticketDetail.price, params.token)
            .then(async ({ amount, currency }) => {
              return await new BookingTicket({
                ticketId: ticketDetail._id,
                ticketAmount: params.ticketAmount,
                ticketPrice: ticketDetail.price,
                status: true
              }).save().then(async (bookingTicketDetail) => {
                return await {
                  bookTicketAction: true,
                  ticketCost: amount,
                  bookedTicketDetail: {
                    bookingId: bookingTicketDetail._id,
                    ticketId: bookingTicketDetail.ticketId,
                    ticketAmount: bookingTicketDetail.ticketAmount,
                    ticketPrice: bookingTicketDetail.ticketPrice,
                    status: bookingTicketDetail.status
                  }
                }
              }).catch((error) => {
                throw error
              })
            }).catch((error) => {
              return new BookingTicket({
                ticketId: ticketDetail._id,
                ticketAmount: params.ticketAmount,
                ticketPrice: ticketDetail.ticketPrice,
                status: false
              }).save().then(async (bookingTicketDetail) => {
                bookingHandler(bookingTicketDetail._id) // setTimeout 15mins to remove if Status still false
                return await {
                  bookTicketAction: true,
                  error: error.message,
                  bookedTicketDetail: {
                    bookingId: bookingTicketDetail._id,
                    ticketId: bookingTicketDetail.ticketId,
                    ticketAmount: bookingTicketDetail.ticketAmount,
                    ticketPrice: bookingTicketDetail.ticketPrice,
                    status: bookingTicketDetail.status
                  }
                }
              }).catch((error) => {
                throw error
              })
            })
        }).catch((error) => {
          throw error
        })
    }).catch((error) => {
      throw error
    })
  }
}

module.exports = refactorService
