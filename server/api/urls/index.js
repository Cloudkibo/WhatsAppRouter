var express = require('express');
const controller = require('./urls.controller')
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

router.post('/',
authService.isAuthenticated,
controller.post
);

router.put('/',
authService.isAuthenticated,
controller.put
)

router.delete('/',
authService.isAuthenticated,
controller.delete
)

router.get('/redirectUrl/:id',
// middleware.checkAuth,
controller.getRedirectUrl
)

module.exports = router;
