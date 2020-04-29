'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
const controller = require('./google.controller.js')
var router = express.Router();

router
  .get('/', controller.loginWithGoogle)

router
  .get('/callback', controller.loginCallback);

module.exports = router;
