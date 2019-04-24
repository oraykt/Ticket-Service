/* eslint-disable no-throw-literal */
/* eslint-disable no-return-await */
const Event = require('../models/Event')
const Ticket = require('../models/Ticket')
const BookingTicket = require('../models/BookingTicket')

const paymentGateway = require('./paymentGateway')
const typeChecker = require('../utils/typeChecker')
const getDate = require('../utils/getDate')
const bookingHandler = require('../utils/bookingHandler')

const convertToObjectId = require('mongoose').Types.ObjectId
const TicketService = {
  importEvent: async (params) => {
    typeChecker.totalTickets(params.totalTickets)
    return await new Ticket(
      {
        totalTickets: params.totalTickets,
        ticketPrice: Math.floor(Math.random() * (100 - 50)) + 50 // Generate Random Ticket Price
      }
    ).save()
      .then(async (ticket) => {
        return await new Event(
          {
            name: params.eventName,
            date: getDate(params.eventDate),
            ticketId: ticket._id
          }
        ).save().then(async (importedEvent) => {
          return await {
            importEventAction: true,
            importedEvent
          }
        }).catch((error) => {
          throw error
        })
      })
      .catch((error) => {
        throw error
      })
  },
  getEvents: async () => {
    return await Event.find({}).then(async (events) => {
      return await {
        getEventsAction: true,
        events
      }
    }).catch((error) => {
      throw error
    })
  },
  getEventDetail: async (eventId) => {
    // TODO eventId Validation!
    return await Event.aggregate([
      {
        $match: {
          _id: convertToObjectId(eventId)
        }
      },
      {
        $lookup: {
          from: 'tickets',
          localField: 'ticketId',
          foreignField: '_id',
          as: 'tickets'
        }
      }, {
        $unwind: '$tickets'
      }, {
        $group: {
          _id: {
            _id: '$_id',
            name: '$name',
            date: '$date',
            tickets: '$tickets'
          }
        }
      }, {
        $project: {
          _id: '$_id._id',
          name: '$_id.name',
          date: '$_id.date',
          tickets: '$_id.tickets'
        }
      }
    ]).then(async (eventDetail) => {
      if (eventDetail.length === 0) {
        throw new Error('Event not found!')
      } else {
        eventDetail.forEach((event) => {
          event.tickets.availableTickets = event.tickets.totalTickets - event.tickets.soldTickets
        })
        return await {
          getDetailAction: true,
          event: eventDetail
        }
      }
    }).catch((error) => {
      throw error
    })
  },
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
          return await paymentGateway.charge(params.ticketAmount * ticketDetail.ticketPrice, params.token)
            .then(async ({ amount, currency }) => {
              return await new BookingTicket({
                ticketId: ticketDetail._id,
                ticketAmount: params.ticketAmount,
                ticketPrice: ticketDetail.ticketPrice,
                status: true
              }).save().then(async (bookingTicketDetail) => {
                return await {
                  bookTicketAction: true,
                  ticketCost: amount,
                  currency,
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
  },
  bookForReservedTicket: async (params) => {
    return await BookingTicket.findById(params.bookingId).then(async (bookedTicketDetail) => {
      if (bookedTicketDetail) {
        if (!bookedTicketDetail.status) {
          bookedTicketDetail.status = true
          return await BookingTicket.findByIdAndUpdate(bookedTicketDetail._id, bookedTicketDetail, { new: true })
            .then(async (updatedBookedTicket) => {
              return await {
                bookForReservedTicketAction: true,
                bookingDetails: updatedBookedTicket
              }
            }).catch((error) => {
              throw error
            })
        } else {
          throw new Error('The ticket Id which has booking Id already paid.')
        }
      } else {
        throw new Error('bookingId not found!')
      }
    })
  },
  deleteEvent: (eventId) => {
    return Event.findByIdAndDelete(eventId).then(async (deletedEvent) => {
      if (deletedEvent) {
        return await Ticket.findByIdAndDelete(deletedEvent.ticketId).then(async () => {
          return await {
            deleteEventAction: true
          }
        }).catch((error) => {
          throw error
        })
      } else {
        throw new Error('eventId not found!')
      }
    }).catch((error) => {
      throw error
    })
  }
}

module.exports = TicketService
