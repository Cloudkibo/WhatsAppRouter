'use strict';

var express = require('express');
var passport = require('passport');
const config = require('../config/index')

// Passport Configuration
// require('./google/passport').setup(config);

var router = express.Router();

router.use('/google', require('./google'));

router.get('/logout', (req, res) => {
  // if (!req.user) {
  //   return res.status(404).json({
  //     status: ‘failed’,
  //     description: ‘Something went wrong, please try again.’
  //   })
  // }
  res.clearCookie('token')
  return res.redirect('http://localhost:3000')
})

module.exports = router;
