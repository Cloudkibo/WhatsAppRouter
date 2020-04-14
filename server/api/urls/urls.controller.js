const config = require('../../config/index')


exports.get = (req, res, next) => {
    config.pool.getConnection((err, connection) => {
        if (err) {
            connection.release()
            return config.errorResponse(res, 500, 'Failed to create database connection.', err)
        } else {
            let sql = `SELECT * FROM urls WHERE userId = ${req.user.userId}`
            connection.query(sql, (error, urls) => {
                if (error) {
                    connection.release()
                    return config.errorResponse(res, 500, 'Failed to query database.', error)
                } else {
                    urls.forEach(element => {
                        if (element.baseurl == '1') {
                            element.redirectUrl = `/urls/redirectUrl/${element.id}`
                        }
                    })
                    console.log(urls)
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
            let sql = `SELECT * FROM urls WHERE id = ${req.params.id} OR baseUrlId = ${req.params.id}`
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
            let sql = `SELECT * FROM urls WHERE id = ${req.body.id} OR baseUrlId = ${req.body.id}`
            connection.query(sql, (error, urls) => {
                if (error) {
                    connection.release()
                    return config.errorResponse(res, 500, 'Failed to query database.', error)
                } else {
                    urls = urls.filter(element => (element.baseurl == '0'))
                    req.body.alternetUrl.forEach(element => {
                        if (!element.id) {
                            let data = {
                                url: element.url,
                                participentCount: element.count,
                                baseurl: false,
                                userId: req.user.userId,
                                baseUrlId: req.body.id
                            }
                            let insert = 'INSERT INTO urls SET ?'
                            promise.push(connection.query(insert, data))
                        } else {
                            urls = urls.filter(url => !(url.id === element.id))
                            let data = [
                                element.url,
                                element.count,
                                element.id
                            ]
                            let update = `UPDATE urls SET url = ? , participentCount = ? WHERE id = ?`;
                            promise.push(connection.query(update, data))
                        }
                    })
                    urls.forEach(element => {
                        let sql = `DELETE FROM urls WHERE id = ${element.id}`;
                        promise.push(connection.query(sql))
                    })
                    let data = [
                        req.body.baseUrl,
                        req.body.count,
                        req.body.id
                    ]
                    let sql = `UPDATE urls SET url = ? , participentCount = ? WHERE id = ?`;
                    promise.push(connection.query(sql, data))
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
    })
}

exports.delete = (req, res, next) => {
    config.pool.getConnection((err, connection) => {
        if (err) {
            connection.release()
            return config.errorResponse(res, 500, 'Failed to create database connection.', err)
        } else {
            console.log('i am in delete')
            let sql = `SELECT * FROM urls WHERE id = ${req.body.id} OR baseUrlId = ${req.body.id}`
            connection.query(sql, (error, urls) => {
                if (error) {
                    connection.release()
                    return config.errorResponse(res, 500, 'Failed to query database.', error)
                } else {
                    console.log('in urls', urls)
                    let promise = []
                    urls.forEach(element => {
                        let sql = `DELETE FROM urls WHERE id = ${element.id}`;
                        promise.push(connection.query(sql))
                    })
                    Promise.all(promise)
                        .then(result => {
                            console.log('In Promise', result)
                            return config.successresponse(res, 200, 'Deleted url successfully!')
                        })
                        .catch(err => {
                            console.log(err)
                            return config.errorResponse(res, 500, 'Failed to delete url', err)
                        })
                }
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
                    if (urls.length > 0) {
                        let emptyGroups = []
                        for (let i = 0; i < urls.length; i++) {
                            if (urls[i].participentCount < 250) {
                                emptyGroups.push(urls[i])
                            }
                        }
                        if (emptyGroups.length > 0) {
                            let data = [
                                emptyGroups[0].participentCount + 1,
                                emptyGroups[0].id
                            ]
                            let sql = `UPDATE urls SET participentCount = ? WHERE id = ?`;
                            connection.query(sql, data, (error, updated) => {
                                if (error) {
                                    connection.release()
                                    return config.errorResponse(res, 500, 'Failed to query database.', error)
                                } else {
                                    let uri = emptyGroups[0].url
                                    res.writeHead(301, { Location: uri })
                                    res.end()
                                }
                            })
                        } else {
                            return res.send('This URL is no longer exist')
                        }
                    } else {
                        return config.errorResponse(res, 500, 'No group found in the data base with this URL', error)
                    }
                }
            })
        }
    })
}
