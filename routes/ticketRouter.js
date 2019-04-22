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
})

router.get('/getEventDetail', (req, res) => {
  ticketService.getEventDetail(req.query.eventId)
    .then((event) => {
      res.json({
        getDetailAction: true,
        event: event
      })
    })
    .catch((error) => {
      res.json({
        getDetailAction: false,
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
