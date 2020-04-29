const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');
const bodyParser = require('body-parser')
var debug = require('debug')('wlb:server');
const http = require('http')
const https = require('https')
const fs = require('fs')
require('dotenv').config()

var httpsApp = express()
var httpApp = express()
const app = (process.env.NODE_ENV === 'production') ? httpsApp : httpApp
let options = {
  ca: '',
  key: '',
  cert: ''
}
if (process.env.NODE_ENV === 'production') {
  try {
    options = {
      ca: fs.readFileSync('/root/certs/swlb.ca-bundle'),
      key: fs.readFileSync('/root/certs/swlb.key'),
      cert: fs.readFileSync('/root/certs/swlb.crt')
    }
  } catch (e) {
  }
}
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})
if (process.env.NODE_ENV === 'production') {
  httpApp.get('*', (req, res) => {
    res.redirect(`${process.env.DOMAIN}${req.url}`)
  })
}
app.use('/urls', require('./api/urls'))
app.use('/users', require('./api/user'));
app.use('/auth', require('./auth/index'))
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const error = new Error('Not Found')
  error.status = 404
  next(error);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  })
});

const server = http.createServer(httpApp)
const httpsServer = https.createServer(options, httpsApp)

// listen for requests :)
server.listen(process.env.PORT, process.env.IP, () => {
  console.log(`WLB server STARTED on ${
    process.env.PORT} in ${process.env.NODE_ENV} mode on domain ${process.env.DOMAIN}`)
})
httpsServer.listen(process.env.SECURE_PORT, () => {
  console.log(`WLB server STARTED on ${
    process.env.SECURE_PORT} in ${process.env.NODE_ENV} mode on domain ${process.env.DOMAIN}`)
})


module.exports = app;
