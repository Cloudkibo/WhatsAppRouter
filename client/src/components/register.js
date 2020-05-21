import React, { Component } from "react";
import logo from '../assets/logo.png'
import background from '../assets/bg-3.jpg'
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
        padding: '12px',
        margin: '70px 0px 0px 64px',
        fontSize: '17px',
        width: '300px'
      }
        return (
          <div className="m--skin- m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default" >
            <div className="m-grid m-grid--hor m-grid--root m-page">
              <div className="m-grid__item m-grid__item--fluid m-grid m-grid--hor m-login m-login--singin m-login--2 m-login-2--skin-2" id="m_login" style={{backgroundImage: `url(${background})`, minHeight: '637px'}}>
                <div className="m-grid__item m-grid__item--fluid	m-login__wrapper">
                  <div className="m-login__container">
                  	<div className="m-login__logo">
							        <a href="#">
								        <img src={logo} />
							         </a>
						         </div>
                     <div className="m-login__signin">
							         <div className="m-login__head">
								         <h3 className="m-login__title">
									         Sign Up
								         </h3>
							          </div>

               {
                 this.state.url &&
                 <a href={this.state.url} style={btn} className="btn btn-danger m-btn m-btn--icon m-login__head m-login__title">
                    <span>
                      <i className="fa fa-google fa-fw" />
                      <span>
                        Signup with Google
                      </span>
                    </span>
                  </a>
              }
						</div>
            <div className="m-login__account">
              <span className="m-login__account-msg">
                Already a member? ?
              </span>
              &nbsp;&nbsp;
              <a href="/login" id="m_login_signup" className="m-link m-link--light m-login__account-link">
                Login
              </a>
            </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}
