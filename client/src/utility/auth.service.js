import cookie from 'react-cookies'

const  auth = {
    getToken() {
        return cookie.load('token')
    },

    getUserId() {
      return cookie.load('userId')
    },

    putCookie(val) {
        cookie.save('token', val)
    },

    putUserId(val) {
        cookie.save('userid', val)
    },

    logout(cb) {
        cookie.remove('token')
        cookie.remove('userId')
        // redirectToLogoutAccounts()
        if (cb) cb()
    },

    loggedIn() {
        const userId = cookie.load('userId')
        const token = cookie.load('token')
        return !(typeof token === 'undefined' || token === '' || typeof userId === 'undefined' || userId === '')
    }
}

function redirectToLogoutAccounts() {
    let redirectUrls = {
        'wlb': 'https://wlb.cloudkibo.com/auth/logout',
        'swlb': 'https://swlb.cloudkibo.com/auth/logout',
        'localhost': 'http://localhost:3000/auth/logout'
    }
    let products = Object.keys(redirectUrls)
    for (let i = 0; i < products.length; i++) {
        if (window.location.href.includes(products[i])) {
            window.location.replace(redirectUrls[products[i]])
            break
        }
    }
}

export default auth
