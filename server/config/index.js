var mysql = require('mysql');

exports.all = {
  JWT_KEY: "cloudkibo",
  sendgrid: {
    username: process.env.SENDGRID_USERNAME,
    password: process.env.SENDGRID_PASSWORD
  }
}

exports.pool = mysql.createPool({
    connectionLimit: 100,
    host     : 'localhost',
    user     : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  })

  exports.successresponse = (response, status, description, payload) => {
    return response.status(status).json({
      description: description,
      payload: payload
    })
  }

  exports.errorResponse = (response, status, description, error) => {
    return response.status(status).json({
      description: description,
      error: JSON.stringify(error)
    })
  }
