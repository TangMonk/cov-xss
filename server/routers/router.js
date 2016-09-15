const express = require('express')
const router = express.Router()

const signUp = require('./signUp')

router.get('/user/:id', function (req, res) {
  res.send('OK 233')
})

router.get('/', function (req, res) {
  res.render('index', { title: 'index', bundle: 'index'})
})

router.get('/login', function (req, res) {
  res.render('login', { title: 'login', bundle: 'login'})
})

router.post('/login', signUp)

module.exports = router