/* eslint-disable no-throw-literal */
module.exports = ({ year = new Date().getFullYear() + 1, month = 1, date = 1, hours = 1, minutes = 11 }) => {
  if (new Date(year, month - 1, date, hours, minutes) > new Date()) {
    return new Date(year, month - 1, date, hours, minutes).toString()
  } else {
    throw 'eventDate passed!'
  }
}
