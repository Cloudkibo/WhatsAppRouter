const config = require('./config/index')


function getSendGridObject () {
  let Sendgrid = require('sendgrid-web');
  var sendgrid = new Sendgrid({
        user: config.all.sendgrid.username,
        key:  config.all.sendgrid.password
      });

  return sendgrid
}

exports.getSendGridObject = getSendGridObject
