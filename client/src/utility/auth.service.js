const axios = require('axios');
const proxy = 'http://localhost:4200/'


export const register = newUser => {
    return axios
        .post(`${proxy}signup/`,{
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
            phone: newUser.phone,
            password: newUser.password,
            confirmPassword: newUser.confirmPassword
        })
        .then(res => {
            console.log("Registered!", res)
            return res
        })
}

export const login = user => {
    return axios
        .post(`${proxy}login`,{
            email: user.email,  
            password: user.password,
        })
        .then(res => {
            localStorage.setItem('userToken', res.data.payload.token)
            return res.data
        })
        .catch(error => {
            console.log(error)
        })
}

export default login