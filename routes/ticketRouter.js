const express = require('express')
const router = express.Router()
const ticketService = require('../services/ticketService')
const refactorService = require('../services/refactorService')
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
        error: error.message
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
          error: error.message
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
          error: error.message
        })
      })
  }
})

router.get('/getEventDetail', (req, res) => {
  ticketService.getEventDetail(req.query.eventId)
    .then((eventDetail) => {
      if (eventDetail.length === 0) {
        // eslint-disable-next-line no-throw-literal
        throw 'Event not Found!'
      } else {
        eventDetail.forEach((event) => {
          event.tickets.availableTickets = event.tickets.totalTickets - event.tickets.soldTickets
        })
        res.json({
          getDetailAction: true,
          event: eventDetail
        })
      }
    })
    .catch((error) => {
      res.json({
        getDetailAction: false,
        error
      })
    })
})

router.put('/bookTicket', (req, res) => {
  refactorService.bookTicket(req.body).then((bookingDetail) => {
    res.json(
      bookingDetail
    )
  }).catch((error) => {
    console.log(error)
  })

  // ticketService.bookTicket(req.body)
  //   .then(({ price, currency, bookedTicket }) => {
  //     res.json({
  //       bookTicketAction: true,
  //       price,
  //       currency,
  //       bookedTicket
  //     })
  //   })
  //   .catch((error) => {
  //     res.json({
  //       bookTicketAction: false,
  //       error
  //     })
  //   })
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
