'use strict';
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../config');
var validateJwt = expressJwt({ secret: config.all.JWT_KEY });
var compose = require('composable-middleware');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];;
}

function isAuthenticated(req, res, next) {
      try{
        let userId = req.headers.userid
        let token = req.headers.authorization
        req.user = {userId: userId}
        verify(token)
        next();
    } catch (error){
        console.log('i am in google', error)
        res.clearCookie("token");
        res.clearCookie("userId");
        return res.status(401).json({message: 'Access Token Expired Please Sign In Again.'})
      }
}

// function signToken(id) {
//     return jwt.sign({ userId: id }, config.all.JWT_KEY, { expiresIn: 60*24*3 });
//   }

function setTokenCookie(token, userId, req, res) {
  if (!token) return res.json(404, { message: 'Something went wrong, please try again.'});
  // var token = signToken(userId);
  res.cookie('userId', userId)
  res.cookie('token', token);
  console.log(token)
}


exports.isAuthenticated = isAuthenticated;
exports.setTokenCookie = setTokenCookie;
