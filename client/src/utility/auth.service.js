const axios = require('axios');



export const register = newUser => {
    return axios
        .post(`/signup`,{
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
        .post(`/login`,{
            email: user.email,  
            password: user.password,
        })
        .then(res => {
            return res
        })
        .catch(error => {
            console.log(error)
        })
}

export default login