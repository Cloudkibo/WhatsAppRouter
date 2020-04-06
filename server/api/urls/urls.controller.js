const config = require('../../config/index')


exports.get = (req, res, next) => {
    config.pool.getConnection((err, connection) => {
        if (err) {
            connection.release()
            return config.errorResponse(res, 500, 'Failed to create database connection.', err)
        } else {
            let sql = `SELECT * FROM urls`
            connection.query(sql, (error, urls) => {
                if (error) {
                    connection.release()
                    return config.errorResponse(res, 500, 'Failed to query database.', error)
                } else {
                    urls.forEach(element => {
                        if (element.baseurl == '1') {
                            element.redirectUrl = `localhost:4200/urls/redirectUrl/${element.id}`
                        }
                    })
                    return config.successresponse(res, 200, 'fetched all urls successfully!', urls)
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
            let sql = `SELECT * FROM urls WHERE id = ${req.params.id}`
            connection.query(sql, (error, url) => {
                if (error) {
                    connection.release()
                    return config.errorResponse(res, 500, 'Failed to query database.', error)
                } else {

                    return config.successresponse(res, 200, 'url fetched successfully!', url)
                }
            })
        }
    })
}

exports.post = (req, res, next) => {
    config.pool.getConnection((err, connection) => {
        if (err) {
            connection.release()
            return config.errorResponse(res, 500, 'Failed to create database connection.', err)
        } else {
            let data = {
                url: req.body.baseUrl,
                participentCount: req.body.count,
                baseurl: true,
                userId: req.user.userId,
            }
            let sql = 'INSERT INTO urls SET ?'
            connection.query(sql, data, (error, url) => {
                if (error) {
                    connection.release()
                    return config.errorResponse(res, 500, 'Failed to query database.', error)
                } else {
                    let promise = []
                    req.body.alternetUrl.forEach(element => {
                        let data = {
                            url: element.url,
                            participentCount: element.count,
                            baseurl: false,
                            userId: req.user.userId,
                            baseUrlId: url.insertId
                        }
                        promise.push(connection.query(sql, data))
                    });
                    Promise.all(promise)
                        .then(result => {
                            return config.successresponse(res, 200, 'created url successfully!')
                        })
                        .catch(err => {
                            console.log(err)
                            return config.errorResponse(res, 500, 'Failed to create url', err)
                        })
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
            let promise = []
            req.body.urls.forEach(element => {
                let data = [
                    element.url,
                    element.count,
                    element.id
                ]
                let sql = `UPDATE urls SET url = ? , participentCount = ? WHERE id = ?`;
                promise.push(connection.query(sql, data))
            })
            Promise.all(promise)
                .then(result => {
                    return config.successresponse(res, 200, 'updated url successfully!')
                })
                .catch(err => {
                    console.log(err)
                    return config.errorResponse(res, 500, 'Failed to update url', err)
                })
        }
    })
}

exports.getRedirectUrl = (req, res, next) => {
    config.pool.getConnection((err, connection) => {
        if (err) {
            connection.release()
            return config.errorResponse(res, 500, 'Failed to create database connection.', err)
        } else {
            let sql = `SELECT * FROM urls WHERE id = ${req.params.id} OR baseUrlId = ${req.params.id}`
            connection.query(sql, (error, urls) => {
                if (error) {
                    connection.release()
                    return config.errorResponse(res, 500, 'Failed to query database.', error)
                } else {
                    let emptyGroups = []
                    for (let i = 0; i < urls.length; i++) {
                        if (urls[i].participentCount < 250) {
                            emptyGroups.push(urls[i])
                        } else {
                            return config.errorResponse(res, 500, 'All Whatsapp Urls are full.')
                        }
                    }
                    let data = [
                        urls[0].participentCount + 1,
                        urls[0].id
                    ]
                    let sql = `UPDATE urls SET participentCount = ? WHERE id = ?`;
                    connection.query(sql, data, (error, updated) => {
                        if (error) {
                            connection.release()
                            return config.errorResponse(res, 500, 'Failed to query database.', error)
                        } else {
                            let groupId = urls[0].url.split('/')
                            groupId = groupId[groupId.length - 1]
                            let uri = 'https://chat.whatsapp.com/' + groupId
                            console.log(uri)
                            console.log('i am here')
                            res.writeHead(301, { Location: uri })
                            res.end()
                        }
                    })
                }
            })
        }
    })
}