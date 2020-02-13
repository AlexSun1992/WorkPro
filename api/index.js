const express = require('express')
const app = express()
const data = require('./data.js')

app.use(express.json())

app.get('/userinfo', (req, res) => {
    res.send(data.userinfo)
})

app.post('/authorize', (req, res) => {
    if (req.body.login === '9162641917' && req.body.password === 'r12345') {
        res.send(JSON.stringify(data.authData))
    } else {
        res.send(401, "Неверные учетные данные пользователя")
    }
})

module.exports = {
   path: '/api',
   handler: app
}