/* eslint-disable no-throw-literal */
module.exports = (ticketAmount, { soldTickets, totalTickets }) => {
  if (ticketAmount <= totalTickets - soldTickets) {
    return true
  } else {
    throw 'There are not enough available tickets for you!'
  }
}
