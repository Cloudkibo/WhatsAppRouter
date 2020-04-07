var express = require('express');
const controller = require('./auth.controller')

var router = express.Router();

router.post('/signup',
controller.signup
)

router.post('/login',
controller.login
)

module.exports = router;