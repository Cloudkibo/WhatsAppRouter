const axios = require('axios');

exports.callApi = (url, type, data) => {
    headers = {
        "Authorization": `Bearer ${localStorage.userToken}`
    }
    return axios.type(url, data, headers)
}