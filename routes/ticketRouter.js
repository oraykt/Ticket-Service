const express = require('express')
const router = express.Router()
const ticketService = require('../services/ticketService')

router.post('/importEvent', (req, res) => {
  ticketService.importEvent(req.body)
    .then((event) => {
      res.json({
        importEventAction: true,
        importedEvent: event
      })
    })
    .catch((error) => {
      res.json({
        importEventAction: false,
        error
      })
    })
})

router.get('/getEvents', (req, res) => {
  if (req.query.test) {
    ticketService.getEvents()
      .then((events) => {
        events = events.filter(event => event._id.toString() === req.query.eventId)
        res.json({
          getEventsAction: true,
          events
        })
      })
      .catch((error) => {
        res.json({
          getEventsAction: false,
          error
        })
      })
  } else {
    ticketService.getEvents()
      .then((events) => {
        res.json({
          getEventsAction: true,
          events
        })
      })
      .catch((error) => {
        res.json({
          getEventsAction: false,
          error
        })
      })
  }
})

router.get('/getEventDetail', (req, res) => {
  ticketService.getEventDetail(req.query.eventId)
    .then((eventDetail) => {
      eventDetail.forEach((event) => {
        event.tickets.availableTickets = event.tickets.totalTickets - event.tickets.soldTickets
      })
      res.json({
        getDetailAction: true,
        event: eventDetail
      })
    })
    .catch((error) => {
      res.json({
        getDetailAction: false,
        error
      })
    })
})

router.put('/bookTicket', (req, res) => {
  ticketService.bookTicket(req.body)
    .then((bookedTicket) => {
      res.json({
        bookTicketAction: true,
        bookedTicket
      })
    })
    .catch((error) => {
      res.json({
        bookTicketAction: false,
        error
      })
    })
})

router.delete('/deleteEvent', (req, res) => {
  ticketService.deleteEvent(req.body.eventId)
    .then(() => {
      res.json({
        deleteEventAction: true
      })
    })
    .catch((error) => {
      res.json({
        deleteEventAction: false,
        error
      })
    })
})

module.exports = router
