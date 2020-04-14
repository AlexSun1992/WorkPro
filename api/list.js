const express = require('express')
const app = express()
const axios = require('axios')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())

import listConverter from '../converters/list'
import consts from '../api/urls'

const modules = {}
const menu = {}

app.get('/list/:idModule/:idItem', (req, res) => {
  try {
    if(req.cookies){
      axios.defaults.headers.common['Authorization'] = req.cookies['auth._token.local']
      axios.defaults.baseURL = 'https://mobiletest.reso.ru';
    }
    axios({url: `${consts.DATA}/${req.params.idModule}/${req.params.idItem}`, method: 'GET'})
      .then(resp => {
        res.send(listConverter.list(resp.data))
      })
      .catch(err => {
        res.send(err.response.data)
      })
  } catch (e) {
    res.send(e)
  }
})

module.exports = {
  path: '/api',
  handler: app
}
