const express = require('express')
const morgan = require('morgan')
const app = express()
const fs = require('fs')
const appError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRoute = require('./routes/tourRoute')
const userRoute = require('./routes/userRoute')

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}

app.use(express.json())
app.use('/api/v1/tours', tourRoute)
app.use('/api/v1/users', userRoute)

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app

