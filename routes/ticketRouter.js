const express = require('express')
const router = express.Router()
const ticketService = require('../services/ticketService')
const refactorService = require('../services/refactorService')
router.post('/importEvent', (req, res) => {
  ticketService.importEvent(req.body)
    .then((importedEventDetail) => {
      res.json(importedEventDetail)
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
        res.json(events)
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
        res.json(events)
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
      res.json(eventDetail)
    }).catch((error) => {
      res.json({
        getDetailAction: false,
        error: error.message
      })
    })
})

router.put('/bookTicket', (req, res) => {
  ticketService.bookTicket(req.body).then((bookingDetail) => {
    res.json(
      bookingDetail
    )
  }).catch((error) => {
    res.json({
      bookTicketAction: false,
      error: error.message
    })
  })
})

router.put('/reservedTicket', (req, res) => {
  ticketService.bookForReservedTicket(req.body).then((bookingDetail) => {
    res.json(bookingDetail)
  }).catch((error) => {
    res.json({
      bookForReservedTicketAction: false,
      error: error.message
    })
  })
})

router.delete('/deleteEvent', (req, res) => {
  ticketService.deleteEvent(req.body.eventId)
    .then((deleteAction) => {
      res.json(deleteAction)
    })
    .catch((error) => {
      res.json({
        deleteEventAction: false,
        error: error.message
      })
    })
})

module.exports = router
