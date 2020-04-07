const config = require('../../config/index')


exports.get = (req, res, next) => {
    config.pool.getConnection((err, connection) => {
        if (err) {
            connection.release()
            return config.errorResponse(res, 500, 'Failed to create database connection.', err)
        } else {
            let sql = `SELECT * FROM users`
            connection.query(sql, (error, user) => {
                if (error) {
                    connection.release()
                    return config.errorResponse(res, 500, 'Failed to query database.', error)
                } else {
                    return config.successresponse(res, 200, 'fetched all users successfully!', user)
                }
            })
        }
    })
}

exports.getById = (req, res, next) => {
    config.pool.getConnection((err, connection) => {
        if (err) {
            connection.release()
            return config.errorResponse(res, 500, 'Failed to create database connection.', err)
        } else {
            let sql = `SELECT * FROM users WHERE userId = ${req.params.id}`
            connection.query(sql, (error, user) => {
                if (error) {
                    connection.release()
                    return config.errorResponse(res, 500, 'Failed to query database.', error)
                } else {

                    return config.successresponse(res, 200, 'user fetched successfully!', user)
                }
            })
        }
    })

}

exports.put = (req, res, next) => {
    config.pool.getConnection((err, connection) => {
        if (err) {
            connection.release()
            return config.errorResponse(res, 500, 'Failed to create database connection.', err)
        } else {
            let sql = `SELECT * FROM users WHERE userId = ${req.params.id}`
            connection.query(sql, (error, user) => {
                if (error) {
                    connection.release()
                    return config.errorResponse(res, 500, 'Failed to query database.', error)
                } else {
                    let data = [
                        req.body.firstname || user[0].firstname,
                        req.body.lastname || user[0].lastname,
                        req.params.id
                    ]
                    let sql = `UPDATE users SET firstname = ? , lastname = ? WHERE userId = ?`;
                    connection.query(sql, data, (error, user) => {
                        if (error) {
                            connection.release()
                            return config.errorResponse(res, 500, 'Failed to query database.', error)
                        } else {
                            return config.successresponse(res, 200, 'user successfully updated!', user)
                        }
                    })
                }
            })
        }
    })
}