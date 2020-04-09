var express = require('express');
const controller = require('./urls.controller')
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

router.post('/', 
middleware.checkAuth,
controller.post
);

router.put('/', 
middleware.checkAuth,
controller.put
)

router.delete('/',
middleware.checkAuth,
controller.delete
)

router.get('/redirectUrl/:id',
// middleware.checkAuth,
controller.getRedirectUrl
)

module.exports = router;