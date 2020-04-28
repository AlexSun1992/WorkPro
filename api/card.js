const express = require('express')
const app = express()
const axios = require('axios')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())

import formConverter from '../converters/form'
import consts from '../api/urls'

const modules = {}
const menu = {}

app.get('/card/:idModule/:idItem/:id', (req, res) => {
  try {
    if(req.cookies){
      axios.defaults.headers.common['Authorization'] = req.cookies['auth._token.local']
      axios.defaults.baseURL = 'https://mobiletest.reso.ru';
    }
    axios({url: `${consts.DATACARD}/${req.params.idModule}/${req.params.idItem}/${req.params.id}`, method: 'GET'})
      .then(resp => {
        res.send(formConverter.form(resp.data))
      })
      .catch(err => {
        console.log(err)
        res.send(err)
      })
  } catch (e) {
    res.send(e)
  }
})
app.post('/card/:idModule/:idItem/:id', (req, res) => {
  try {
    if(req.cookies){
      axios.defaults.headers.common['Authorization'] = req.cookies['auth._token.local']
      axios.defaults.baseURL = 'https://mobiletest.reso.ru';
    }
    const typeReq = req.params.id === 0 ? 'post' : 'put'
    axios[typeReq](`${consts.DATACARD}/${req.params.idModule}/${req.params.idItem}/${req.params.id}`, formConverter.save(req.body))
      .then(resp => {
        res.send(resp.data[0])
      })
      .catch(err =>  res.send(err.response.data))
} catch (e) {
  res.send(e)
}
})

module.exports = {
  path: '/api',
  handler: app
}
