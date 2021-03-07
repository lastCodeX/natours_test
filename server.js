const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({path: './config.env'})
const app = require('./app')

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

app.listen(port, () => {
  console.log('Server listen port 3000...')
})