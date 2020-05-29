const {google} = require('googleapis');
var config = require('../../config');
var authService = require('../auth.service.js')
const utility = require('../../utility.js')
const logicLayer = require('./logiclayer.js')

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  redirect: process.env.GOOGLE_CALLBACK_URL
};

let login = false;

const defaultScope = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];
// scope: [
//   'https://www.googleapis.com/auth/userinfo.profile',
//   'https://www.googleapis.com/auth/userinfo.email'
// ]


function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope
  });
}

function getGooglePlusApi(auth) {
  return google.plus({ version: 'v1', auth });
}

exports.loginWithGoogle = (req, res) => {
  if(!login) {
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    console.log(url)
    res.status(200).json({url})
    // res.redirect(url);
  } else {

  }
}

exports.loginCallback = (req, res) => {
  const code = req.query.code
  getGoogleAccountFromCode(code, req, res);
}

async function getGoogleAccountFromCode(code, req, res) {

  const auth = createConnection();

  // get the auth "tokens" from the request
  const data = await auth.getToken(code);
  const tokens = data.tokens;

  // add the tokens to the google api so we have access to the account
  auth.setCredentials(tokens);
  console.log(tokens)
  // connect to google plus - need this to get the user's email
  // const plus = getGooglePlusApi(auth);
  google.people('v1').people.get({
    resourceName: 'people/me',
    personFields: 'emailAddresses,names',
    auth,
  }, (err, response) => {
    if(err){
      console.log(err)
    } else {
      console.log(response.data)
      config.pool.getConnection((err, connection) => {
        if (err) {
          connection.release()
          return config.errorResponse(res, 500, 'Failed to create database connection.', err)
        } else {
          let googleId = response.data.resourceName.split('/')[1]
          let sql = `SELECT * FROM users WHERE googleId = ${googleId}`
          connection.query(sql, (error, user) => {
            if (error) {
              connection.release()
              return config.errorResponse(res, 500, 'Failed to create database connection.', err)
            } else {
              if (user.length <= 0) {
                let newUser = {
                  firstname: response.data.names[0].givenName,
                  lastname: response.data.names[0].familyName,
                  email: response.data.emailAddresses[0].value,
                  provider: 'google',
                  googleId: googleId
                }
                let sql = 'INSERT INTO users SET ?'
                connection.query(sql, newUser, (err, result) => {
                  if (err) {
                    return config.errorResponse(res, 500, 'Failed to create database connection.', err)
                  } else {
                    authService.setTokenCookie(tokens.id_token, result.insertId, req, res)
                    let sendgrid = utility.getSendGridObject()
                    let emailHeader = logicLayer.emailHeader(newUser)
                    let emailBody = logicLayer.setEmailBody('abcd', newUser)
                    let email = {
                      to: emailHeader.to,
                      from: emailHeader.from,
                      subject: emailHeader.subject,
                      text: emailHeader.text,
                      html: emailBody
                    }
                    sendgrid.send(email, function (err) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log("Success.");
                      }
                    });
                    res.redirect('/')
                  }
                })
              } else {
                authService.setTokenCookie(tokens.id_token, user[0].userId, req, res)
                res.redirect('/')
              }
            }
          })
        }
      })
    }

  })
}
