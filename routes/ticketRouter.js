const express = require('express')
const router = express.Router()
const ticketService = require('../services/ticketService')

router.post('/importEvent', (req, res) => {
  console.log(req.body)
  ticketService.importEvent(req.body)
    .then((event) => {
      res.json(
        {
          importedEvent: event
        }
      )
    })
    .catch((error) => {
      res.json({ error })
    })
})

router.delete('/deleteEvent', (req, res) => {
  ticketService.deleteEvent(req.body.eventId)
    .then(() => {
      res.json({
        deletedEvent: true
      })
    })
    .catch(() => {
      res.json({
        deletedEvent: false
      })
    })
})

module.exports = router
