var mysql = require('mysql');

exports.all = {
  JWT_KEY: "cloudkibo" 
}

exports.pool = mysql.createPool({
    connectionLimit: 100,
    host     : 'localhost',
    user     : 'root',
    password : '',
    database: 'WLB'
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

  "hello"