class appError extends Error {
  constructor(message, statusCode) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'errors'
    this.isOperationel = true

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = appError