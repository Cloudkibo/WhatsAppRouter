const jwt = require('jsonwebtoken')
const config = require('../config/index')

exports.checkAuth = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, config.all.JWT_KEY)
        req.user = decoded
        next();
    } catch (error){
        config.errorResponse(res, 401, 'Authentication failed please login first.', error)
    };
}