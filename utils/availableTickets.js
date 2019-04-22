/* eslint-disable no-throw-literal */
module.exports = (ticketAmount, { soldTickets, totalTickets }) => {
  if (ticketAmount !== null && ticketAmount !== undefined) {
    if (!isNaN(ticketAmount)) {
      if (ticketAmount <= totalTickets - soldTickets) {
        return true
      } else {
        throw 'There are not enough available tickets for you!'
      }
    } else {
      throw 'ticketAmount must be Number!'
    }
  } else {
    throw 'ticketAmount must be defined!'
  }
}
