/* eslint-disable no-throw-literal */
/* eslint-disable no-return-await */
const Event = require('../models/Event')
const Ticket = require('../models/Ticket')
const paymentGateway = require('./paymentGateway')
const checkAvailableTickets = require('../utils/availableTickets')
const convertToObjectId = require('mongoose').Types.ObjectId
const TicketService = {
  importEvent: async (params) => {
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
            date: params.eventDate,
            ticketId: ticket._id
          }
        ).save()
      })
      .catch((error) => {
        throw error
      })
  },
  getEvents: async () => {
    return await Event.find({})
  },
  getEventDetail: (eventId) => {
    // TODO eventId Validation!
    return Event.aggregate([
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
    ])
  },
  bookTicket: (params) => {
    return Ticket.findById(params.ticketId).then((ticketDetail) => {
      if (ticketDetail) {
        try {
          checkAvailableTickets(params.ticketAmount, ticketDetail)
          return paymentGateway.charge(params.ticketAmount * ticketDetail.ticketPrice, 'true')
            .then(async ({ amount, currency }) => {
              ticketDetail.soldTickets += params.ticketAmount
              return await Ticket.findByIdAndUpdate(params.ticketId, ticketDetail, { new: true })
                .then(async (bookedTicket) => {
                  return await { price: amount, currency, bookedTicket }
                })
            }).catch((error) => {
              throw error
            })
        } catch (error) {
          throw error
        }
      } else {
        throw 'ticketId not found!'
      }
    }).catch((error) => {
      throw error
    })
  },
  deleteEvent: (eventId) => {
    return Event.findByIdAndDelete(eventId).then(async (deletedEvent) => {
      if (deletedEvent) {
        return await Ticket.findByIdAndDelete(deletedEvent.ticketId)
      } else {
        throw 'eventId not found!'
      }
    }).catch((error) => {
      throw error
    })
  }
}

module.exports = TicketService
