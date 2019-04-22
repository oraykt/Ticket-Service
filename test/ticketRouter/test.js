/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const server = require('../../app')
const mongoose = require('mongoose')
chai.use(chaiHttp)

let testEventId
let testTicketId
const test_totalTickets = 30
const test_eventName = 'TEST'
const test_eventDate = '2019-04-22T16:33:50.903Z'
const test_ticketAmount = 10

describe('Wait MongoDB Connection', () => {
  before((done) => {
    mongoose.connection.on('open', () => {
      done()
    })
  })
})

describe('Import an event', () => {
  it('It should return importedEvent', (done) => {
    chai.request(server)
      .post('/api/v1/ticket/importEvent')
      .set('content-type', 'application/json')
      .send({
        'totalTickets': test_totalTickets,
        'eventName': test_eventName,
        'eventDate': test_eventDate
      })
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.an('Object')
        res.body.should.have.property('importEventAction')
        res.body.importEventAction.should.be.eql(true)
        res.body.should.have.property('importedEvent')
        res.body.importedEvent.should.be.an('Object')
        res.body.importedEvent.should.have.property('_id')
        testEventId = res.body.importedEvent._id
        res.body.importedEvent.should.have.property('name')
        res.body.importedEvent.name.should.be.eql(test_eventName)
        res.body.importedEvent.should.have.property('date')
        res.body.importedEvent.date.should.be.eql(test_eventDate)
        res.body.importedEvent.should.have.property('ticketId')
        testTicketId = res.body.importedEvent.ticketId
        done()
      })
  })
})

describe('Get Events', () => {
  it('It should return Events', (done) => {
    chai.request(server)
      .get('/api/v1/ticket/getEvents?test=true&eventId=' + testEventId)
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.an('Object')
        res.body.should.have.property('getEventsAction')
        res.body.getEventsAction.should.be.eql(true)
        res.body.should.have.property('events')
        res.body.events.should.be.an('array')
        res.body.events.length.should.be.eql(1)
        res.body.events.forEach((event) => {
          event.should.have.property('_id')
          event._id.should.be.eql(testEventId)
          event.should.have.property('name')
          event.name.should.be.eql(test_eventName)
          event.should.have.property('date')
          event.date.should.be.eql(test_eventDate)
          event.should.have.property('ticketId')
          event.ticketId.should.be.eql(testTicketId)
        })
        done()
      })
  })
})

describe('Get Event Detail', () => {
  it('It should return an Event Detail', (done) => {
    chai.request(server)
      .get('/api/v1/ticket/getEventDetail?eventId=' + testEventId)
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('Object')
        res.body.should.have.property('getDetailAction')
        res.body.getDetailAction.should.be.eql(true)
        res.body.should.have.property('event')
        res.body.event.should.be.an('array')
        res.body.event[0].should.be.an('Object')
        res.body.event[0].should.have.property('_id')
        res.body.event[0].should.have.property('name')
        res.body.event[0].name.should.be.eql(test_eventName)
        res.body.event[0].should.have.property('date')
        res.body.event[0].date.should.be.eql(test_eventDate)
        res.body.event[0].should.have.property('tickets')
        res.body.event[0].tickets.should.be.an('Object')
        res.body.event[0].tickets.should.have.property('_id')
        res.body.event[0].tickets._id.should.be.eql(testTicketId)
        res.body.event[0].tickets.should.have.property('soldTickets')
        res.body.event[0].tickets.soldTickets.should.be.eql(0)
        res.body.event[0].tickets.should.have.property('totalTickets')
        res.body.event[0].tickets.totalTickets.should.be.eql(test_totalTickets)
        res.body.event[0].tickets.should.have.property('ticketPrice')
        res.body.event[0].tickets.should.have.property('availableTickets')
        const availableTickets = res.body.event[0].tickets.totalTickets - res.body.event[0].tickets.soldTickets
        res.body.event[0].tickets.availableTickets.should.be.eql(availableTickets)
        done()
      })
  })
})

describe('Book Ticket on Test Event', () => {
  it('It should return bookedTicketDetails', (done) => {
    chai.request(server)
      .put('/api/v1/ticket/bookTicket')
      .set('content-type', 'application/json')
      .send({
        'ticketId': testTicketId,
        'ticketAmount': test_ticketAmount
      })
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('Object')
        res.body.should.have.property('bookTicketAction')
        res.body.bookTicketAction.should.be.eql(true)
        res.body.should.have.property('bookedTicket')
        res.body.bookedTicket.should.be.an('Object')
        res.body.bookedTicket.should.have.property('soldTickets')
        res.body.bookedTicket.soldTickets.should.be.eql(test_ticketAmount)
        res.body.bookedTicket.should.have.property('_id')
        res.body.bookedTicket.should.have.property('totalTickets')
        res.body.bookedTicket.totalTickets.should.be.eql(test_totalTickets)
        res.body.bookedTicket.should.have.property('ticketPrice')
        res.body.should.have.property('currency')
        res.body.should.have.property('price')
        res.body.price.should.be.eql(res.body.bookedTicket.ticketPrice * test_ticketAmount)
        done()
      })
  })
})

describe('Delete an Event', () => {
  it('It should return true', (done) => {
    chai.request(server)
      .delete('/api/v1/ticket/deleteEvent')
      .set('content-type', 'application/json')
      .send({
        'eventId': testEventId
      })
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('Object')
        res.body.should.have.property('deleteEventAction')
        res.body.deleteEventAction.should.be.eql(true)
        done()
      })
  })
})
