const AppError = require('./../utils/appError')

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const handleDuplicateFieldDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value!`
  return new AppError(message, 400)
}

const handleValidationErrDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message)
  const message = `Invalid input data: ${errors.join('. ')}`
  return new AppError(message, 400)
}

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  })
}

const sendErrProd = (err, res) => {
  // Operational, trusted error 
  if(err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
    //Pogramming or other unknow err
  } else {
    //Logging
    console.error('Error', err)
    //Send message
    res.status(500).json({
      status: 'error',
      message: "Something went verry wrong!"
    })
  }
  
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if(process.env.NODE_ENV === 'development') {
    sendErrDev(err, res)
  } else if(process.env.NODE_ENV === 'production') {
    let error = {...err, name: err.__proto__.name}
    if(error.name === 'CastError') {
      error = handleCastErrorDB(error)
    }
    if(error.code === 11000) {
      error = handleDuplicateFieldDB(error)
    }
    if(error.name === 'ValidationError') {
      error = handleValidationErrDB(error)
    }
    sendErrProd(error, res)
  }
}