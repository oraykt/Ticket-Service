[![Heroku](https://heroku-badge.herokuapp.com/?app=heroku-badge)](https://oraykt-ticketservice.herokuapp.com/)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9149efcfb3b94079ae635af288a5b0d1)](https://app.codacy.com/app/oraykt/Ticket-Service?utm_source=github.com&utm_medium=referral&utm_content=oraykt/Ticket-Service&utm_campaign=Badge_Grade_Settings)
[![Build Status](https://travis-ci.org/oraykt/Ticket-Service.svg?branch=master)](https://travis-ci.org/oraykt/Ticket-Service)

> https://oraykt-ticketservice.herokuapp.com/api-docs/#/

# HIGH LEVEL REQUIREMENTS

1. Task done async
2. Discussion about the task
3. Some tech-talk with prepared questions.

# TASK

## Background

We want to develop ticket-selling platform.

Front-end part of the application is not yet ready so feel free to design API
however you want.

### High level features

1. Get info about an event
2. Get info about about available tickets
3. Purchase ticket

### Feature requirements

*Get info about an event*

1. Event has a name
2. Event has date and time

*Get info about about available tickets*

1. We should be able receive information about what quantity
   of tickets is available.

*Pay for ticket*

1. For the sake of simplicity we operate only on `EUR` currency. Fee free to use provided
   adapter.

### Additional info

1. We really don't want to push you in any certain direction but if you've
   made certain assumptions how it should work with FE then please let us know.
   TL;DR - you can briefly describe how the whole app would interact.
2. Tests would be appreciated but are not required.

### The Solution:

- [TicketRouter.js](https://github.com/oraykt/Ticket-Service/blob/master/routes/ticketRouter.js) is Ticket-Service Router
- [TicketService.js](https://github.com/oraykt/Ticket-Service/blob/master/services/ticketService.js) has the Main Function
- [Utils](https://github.com/oraykt/Ticket-Service/tree/master/utils) has Logical Controllers
- [Views](https://github.com/oraykt/Ticket-Service/tree/master/views) The interface haven't implemented yet.
- [Test.js](https://github.com/oraykt/Ticket-Service/blob/master/test/ticketRouter/test.js) is the tests
- [Test Logs(Travis-ci)](https://travis-ci.org/oraykt/Ticket-Service)

## Installation

It doesn't have private npm repo currently so we need to clone Ticket-Service from git repo and install it locally via 

```bash
git clone https://github.com/oraykt/Ticket-Service.git && cd Ticket-Service && npm install && npm start
```

> http://localhost:3000
