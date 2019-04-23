/* eslint-disable no-throw-literal */
const typeChecker = {
  availableTickets: (ticketAmount, { soldTickets, totalTickets }) => {
    if (ticketAmount !== null && ticketAmount !== undefined) {
      if (!isNaN(ticketAmount)) {
        if (ticketAmount <= totalTickets - soldTickets) {
          return true
        } else {
          throw new Error('There are not enough available tickets for you!')
        }
      } else {
        throw new Error('ticketAmount must be Number!')
      }
    } else {
      throw new Error('ticketAmount must be defined!')
    }
  },
  ticketAmount: (ticketAmount) => {
    if (!isNaN(ticketAmount)) {
      if (ticketAmount > 0) {
        return true
      } else {
        throw new Error('ticketAmount must be above 0!')
      }
    } else {
      throw new Error('ticketAmount must be Number!')
    }
  },
  totalTickets: (totalTickets) => {
    if (!isNaN(totalTickets)) {
      if (totalTickets > 0) {
        return true
      } else {
        throw new Error('totalTickets must be above 0!')
      }
    } else {
      throw new Error('totalTickets must be Number!')
    }
  }

}

module.exports = typeChecker
