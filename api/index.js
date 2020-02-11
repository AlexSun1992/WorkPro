const express = require('express')
const app = express()
const data = require('./data.js')

app.get('/getdata', (req, res) => {
    res.send(JSON.stringify(data.users))
})

module.exports = {
   path: '/api',
   handler: app
}