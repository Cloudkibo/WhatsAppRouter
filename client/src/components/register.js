import React, { Component } from "react";
const axios = require('axios');


export default class SignUp extends Component {
    constructor() {
        super();
        this.state = {
          url: ''
        }
        this.googleLogin = this.googleLogin.bind(this)

    }

    componentDidMount() {
      this.googleLogin()
    }

    googleLogin(){
        axios
        .get('/auth/google')
        .then(res => {
            this.setState({url: `${res.data.url}`})
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {
      var btn = {
        width: '70%',
        padding: '12px',
        border: 'none',
        borderRadius: '4px',
        margin: '5px 0',
        marginLeft:'50px',
        opacity: '0.85',
        display: 'inline-block',
        fontSize: '17px',
        lineHeight: '20px',
        textDecoration: 'none',
        backgroundColor: '#dd4b39',
        color: 'white'
      }
        return (
          <div style={{minHeight: '1000px', backgroundColor: '#e6e6e6'}}>
              <div className="auth-wrapper" >
                  <div className="auth-inner" style={{marginTop: '150px'}}>
                          <h3>Sign Up</h3>
                          {
                            this.state.url &&
                            <a style={{marginTop: '20px'}} href={this.state.url} style={btn} className="google btn"><i className="fa fa-google fa-fw">
                              </i> Signup with Google
                            </a>
                          }
                          <p style={{marginLeft: '75px'}}>Already a member? <a href='/login'>Login</a></p>
                  </div>
              </div>
          </div>
        );
    }
}
