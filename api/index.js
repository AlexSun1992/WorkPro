const express = require('express');
const app = express();
const data = require('./data.js');
const axios = require('axios');

app.use(express.json())

app.get('/userinfo', (req, res) => {
    // res.send(data.userinfo)
    throw new Error('Ошибка')
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
            if(!response.data.success || response.data.score < 0.4) {
                return res.json({'msg': 'Robot', 'score': response.score})
            }
            if (req.body.phone === '+7(916)-264-19-17' && req.body.password === 'r12345') {
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

app.post('/password', (req, res) => {
    // try {
    //     if (req.body.phone === '+7(916)-264-19-17' || req.body.phone === '+7(916)-264-19-16') {
    //         res.send(JSON.stringify(data.code))
    //     } else {
    //         res.send(false)
    //     }
    // } catch (e) {
    //     console.log(e)
    // }
    res.send(JSON.stringify(data.code))
})

app.post('/registration', (req, res) => {
    try {
        axios.post('https://mobiletest.reso.ru/free/v2/registration', req.body.form)
            .then(response => {
                res.send(response.data)
            })
    } catch (e) {
        console.log(e);
    }
})

module.exports = {
   path: '/api',
   handler: app
}
