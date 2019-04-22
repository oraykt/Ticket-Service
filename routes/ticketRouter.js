const express = require('express')
const router = express.Router()
const ticketService = require('../services/ticketService')

router.post('/importEvent', (req, res) => {
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

module.exports = router
