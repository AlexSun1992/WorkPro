const express = require('express');
const app = express();
const data = require('./data.js');
const axios = require('axios');

app.use(express.json())

app.get('/userinfo', (req, res) => {
    res.send(data.userinfo)
})

app.post('/authorize', (req, res) => {

    const secretKey = '6LeO2dgUAAAAAHPdFocD12YZkikMpGk--oUz5OdI';
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;

    if(!req.body.captcha) {
        return res.json({'msg':'captcha token is undefined'})
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    axios.get(`${verifyUrl}`)
        .then(response => {
            console.log(response)
            if(!response.data.success || response.data.score < 0.4) {
                return res.json({'msg': 'Robot', 'score': response.score})
            } 

            if (req.body.username === '9162641917' && req.body.password === 'r12345') {
                console.log(response.data.success);
                console.log(response.data.score);
                res.send(JSON.stringify(data.authData))
            } else {
                res.send(401, "Неверные учетные данные пользователя")
            }
        })
        .catch(error => {
            console.log(error);
        });
})

module.exports = {
   path: '/api',
   handler: app
}