const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../../config/index')

exports.signup = (req, res, next) => {
    if (req.body.password === req.body.confirmPassword) {
        config.pool.getConnection((err, connection) => {
            if (err) {
                connection.release()
                return config.errorResponse(res, 500, 'Failed to create database connection.', err)
            } else {
                let sql = `SELECT * FROM users WHERE email = '${req.body.email}'`
                connection.query(sql, (error, user) => {
                    if (error) {
                        connection.release()
                        return config.errorResponse(res, 500, 'Failed to query database.', error)
                    } else {
                        if (user.length > 0) {
                            connection.release()
                            return config.errorResponse(res, 202, 'Email already exist.')
                        } else {
                            let sql = `SELECT * FROM users WHERE phone = '${req.body.phone}'`
                            connection.query(sql, (error, userPhone) => {
                                if (error) {
                                    connection.release()
                                    return config.errorResponse(res, 500, 'Failed to query database.', error)
                                } else {
                                    if (userPhone.length > 0) {
                                        connection.release()
                                        return config.errorResponse(res, 202, 'Phone already exist.')
                                    } else {
                                        bcrypt.hash(req.body.password, 10, (err, hash) => {
                                            if (err) {
                                                connection.release()
                                                return config.errorResponse(res, 500, 'Error in hashing password.', err)
                                            } else {
                                                let user = {
                                                    firstname: req.body.firstname,
                                                    lastname: req.body.lastname,
                                                    email: req.body.email,
                                                    phone: req.body.phone,
                                                    password: hash
                                                }
                                                let sql = 'INSERT INTO users SET ?'
                                                connection.query(sql, user, (err, result) => {
                                                    if (err) {
                                                        connection.release()
                                                        return config.errorResponse(res, 500, 'Failed to query database.', err)
                                                    } else {
                                                        return config.successresponse(res, 200, 'registered successfully!', user)
                                                    }
                                                })
                                            }
                                        })
                                    }

                                }
                            })

                        }
                    }
                })
            }
        })
    } else {
        return config.errorResponse(res, 202, 'Confirmation password should be same.')
    }

}

exports.login = (req, res, next) => {
    config.pool.getConnection((err, connection) => {
        if (err) {
            connection.release()
            return config.errorResponse(res, 500, 'Failed to create database connection.', err)
        } else {
            let sql = `SELECT * FROM users WHERE email = '${req.body.email}'`
            connection.query(sql, (error, user) => {
                if (error) {
                    connection.release()
                    return config.errorResponse(res, 500, 'Failed to query database.', error)
                } else {
                    if (user.length < 1) {
                        connection.release()
                        return config.errorResponse(res, 202, 'Email not exist.')
                    } else {
                        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                            if (err) {
                                connection.release()
                                return config.errorResponse(res, 200, 'error in compairing passwords', err)
                            }
                            if (result) {
                                const token = jwt.sign({
                                    email: user[0].email,
                                    userId: user[0].userId
                                },
                                    config.all.JWT_KEY,
                                    {
                                        expiresIn: '1h'
                                    }
                                )
                                let payload = {
                                    userId: user[0].userId,
                                    token: token
                                }
                                connection.release()
                                return config.successresponse(res, 200, 'Authentication successull!', payload)
                            } else {
                                connection.release()
                                return config.errorResponse(res, 202, 'Wrong password')
                            }
                        })
                    }
                }
            })
        }
    })
}