const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')
// routes
const ticketRouter = require('./routes/ticketRouter')
// swagger
// Swagger
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const app = express()
// db connection
require('./helper/db.js')()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    return next()
  }
)

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }))
// create application/json parser
app.use(bodyParser.json())

// Routes
// TODO design api
app.use('/api/v1/ticket', ticketRouter)

app.get('/', (req, res) => {
  res.render('index', {
    title: 'My Ticket Selling Api'
  })
})
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({
    error: res.locals.message
  })
})

module.exports = app
