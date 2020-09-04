const express = require('express')
const app = express()
const axios = require('axios')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())

import selectConverter from '../converters/select'
import consts from '../api/urls'

const modules = {}
const menu = {}

app.get('/dic/:moduleId/:itemId/:name', (req, res) => {
  try {
    if(req.cookies){
      axios.defaults.headers.common['Authorization'] = req.cookies['auth._token.local']
      // axios.defaults.baseURL = 'https://mobiletest.reso.ru';
      axios.defaults.baseURL = 'https://mobile2.reso.ru';
    }
    axios({url: `${consts.DIC}/${req.params.moduleId}/${req.params.itemId}/${req.params.name}`, method: 'GET'})
      .then(resp => {
        res.send(selectConverter.select(resp.data))
      })
      .catch(err => {
        res.status(err.response.data.STATUS).send(err.response.data)
      })
  } catch (e) {
    res.send(e)
  }
})
app.get('/dicwf/:fieldId/:valueId', (req, res) => {
  try {
    if(req.cookies){
      axios.defaults.headers.common['Authorization'] = req.cookies['auth._token.local']
      // axios.defaults.baseURL = 'https://mobiletest.reso.ru';
      axios.defaults.baseURL = 'https://mobile2.reso.ru';
    }
    axios({url: `${consts.DICWF}/${req.params.fieldId}/${req.params.valueId}`, method: 'GET'})
      .then(resp => {
        res.send(selectConverter.select(resp.data))
      })
      .catch(err => {
        res.status(err.response.data.STATUS).send(err.response.data)
      })
  } catch (e) {
    res.send(e)
  }
})

module.exports = {
  path: '/api',
  handler: app
}
