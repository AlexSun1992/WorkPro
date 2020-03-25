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
    axios.defaults.headers.common['Authorization'] = req.headers.authorization
    if(req.cookies){
      //axios.defaults.headers.common['Authorization'] = req.cookies['auth._token.local']
    }
    axios({url: `${consts.DATA}/${req.params.idModule}/${req.params.idItem}`, method: 'GET'})
      .then(resp => {
        res.send(listConverter.list(resp.data))
      })
      .catch(err => {
        res.send(err.response.data)
      })
  } catch (e) {
    console.log(e)
  }
})

module.exports = {
  path: '/api',
  handler: app
}
