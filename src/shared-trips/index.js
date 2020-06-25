require('dotenv').config()
const env = process.env.NODE_ENV

const mongoose = require('mongoose')
const config = require('./config/config')[env]
const express = require('express')
//TODO require routes
const app = express()

mongoose.connect(config.databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) {
    console.error(err)
    throw err
  }

  console.log('Database is setup and running')
})

require('./config/express')(app)

//TODO use routes

app.get('*', (req, res) => {
  res.render('404', {
    title: 'Error | Cube Workshop'
  })
})

app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`))