const express = require('express')
const app = express()
const axios = require('axios')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())

import listConverter from '../converters/list'
import formConverter from '../converters/form'
import consts from '../api/urls'

const modules = {}
const menu = {}

app.get('/list/:idModule/:idItem/:filters', (req, res) => {
  try {
    if(req.cookies){
      axios.defaults.headers.common['Authorization'] = req.cookies['auth._token.local']
      // axios.defaults.baseURL = 'https://mobiletest.reso.ru';
      axios.defaults.baseURL = 'https://mobile2.reso.ru';
    }
    const filters = listConverter.getFilterParams(formConverter.save(JSON.parse(req.params.filters)))
    axios({url: `${consts.DATA}/${req.params.idModule}/${req.params.idItem}?json=${filters}`, method: 'GET'})
      .then(resp => {
        res.send(listConverter.list(resp.data))
      })
      .catch(err => {
        if (err.response.data.STATUS == 401) {
          res.sendStatus(err.response.data.STATUS);
        } else {
          res.send(err.response.data)
        }
      })
  } catch (e) {
    res.send(e)
  }
})

app.get('/wizardlist/:idModule/:idWizard/:idItem', (req, res) => {
  try {
    if(req.cookies){
      axios.defaults.headers.common['Authorization'] = req.cookies['auth._token.local']
      // axios.defaults.baseURL = 'https://mobiletest.reso.ru';
      axios.defaults.baseURL = 'https://mobile2.reso.ru';
    }
    //const filters = listConverter.getFilterParams(formConverter.save(JSON.parse(req.params.filters)))
    axios({url: `${consts.DATALIST}/${req.params.idModule}/${req.params.idWizard}/${req.params.idItem}?json={}`, method: 'GET'})
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
