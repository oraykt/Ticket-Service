/* eslint-disable no-return-await */
const Event = require('../models/Event')
const Ticket = require('../models/Ticket')

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
  deleteEvent: async (eventId) => {
    return await Event.findByIdAndDelete(eventId).then(async (deletedEvent) => {
      return await Ticket.findByIdAndDelete(deletedEvent.ticketId)
    }).catch((error) => {
      throw error
    })
  }
}

module.exports = TicketService
