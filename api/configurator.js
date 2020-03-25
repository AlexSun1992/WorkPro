const express = require('express')
const app = express()
const axios = require('axios')
const cookieParser = require('cookie-parser')

import converter from '../converters/menu'
import consts from '../api/urls'

import data from './data.js'
app.use(express.json())
app.use(cookieParser())

const modules = {}
const menu = {}

app.get('/module', (req, res) => {
  try {
    if(req.cookies){
      axios.defaults.headers.common['Authorization'] = req.cookies['auth._token.local']
    }
    modules.getItems = () => {
      return new Promise((resolve, reject) => {
        axios({url: `https://mobile2.reso.ru/am/main/v2/module`, method: 'GET'})
          .then(resp => {
            //let modules = converter.modules(resp.data)
            //resolve(modules)
            resolve(resp.data)
          })
          .catch(err => {
            res.send(err)
          })
      })
    }
    menu.getItems = (modules) => {
      return new Promise((resolve, reject) => {
        axios.all(modules.map(l => axios.get(`${consts.MENU}/${l.id}`)))
          .then(axios.spread(function (...res) {
            resolve(res)
          })).catch(err => {
          res.send(err.response.data)
        })
      })
    }
    modules.getItems().then((modules) => {
      menu.getItems(modules).then((menu) => {
        converter.sidebar(modules, menu)
        res.send(modules)
      }).catch(err => {
        res.send(err.response.data)
      })
    })
  } catch (e) {
    res.send(e)
  }
})

module.exports = {
  path: '/api',
  handler: app
}
