var express = require('express');
const controller = require('./users.controller')
const authService = require('../../auth/auth.service.js')

var router = express.Router();

/* GET users listing. */
router.get('/',
authService.isAuthenticated,
controller.get
);

router.get('/:id',
authService.isAuthenticated,
controller.getById
)

router.put('/:id',
authService.isAuthenticated,
controller.put
);

module.exports = router;
