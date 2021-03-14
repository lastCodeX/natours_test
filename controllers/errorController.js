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
    sendErrProd(err, res)
  }
}