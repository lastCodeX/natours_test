const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({path: './config.env'})
const app = require('./app')

process.on('uncaughtRejection', err => {
  console.log(err.name, err.message)
  console.log('UNCAUGHT REJECTION! Shuting down...')
    process.exit(1)
})

const port = process.env.PORT || 3000
const DB = process.env.DATABASE_LOCAL

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true
}).then(con=> {
  console.log('DB connection successful!!')
})

const server = app.listen(port, () => {
  console.log('Server listen port 3000...')
})

process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  console.log('UNHANDLED REJECTION! Shuting down...')
  server.close(() => {
    process.exit(1)
  })
})

