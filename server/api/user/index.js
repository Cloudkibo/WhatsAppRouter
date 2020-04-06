var express = require('express');
const controller = require('./users.controller')
const middleware = require('../../middleware/check.auth')

var router = express.Router();

/* GET users listing. */
router.get('/', 
middleware.checkAuth,
controller.get
);

router.get('/:id', 
middleware.checkAuth,
controller.getById
)

router.put('/:id', 
middleware.checkAuth,
controller.put
);

module.exports = router;