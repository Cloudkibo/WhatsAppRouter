import React, { Component } from "react";
import logo from '../assets/logo.png'
import background from '../assets/bg-4.jpg'
const axios = require('axios');

export default class Login extends Component {
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
        margin: '70px 0px 0px 20px',
        fontSize: '17px',
        width: '300px'
      }

        return (
          <div className="m--skin- m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default" >
          <div className="m-grid m-grid--hor m-grid--root m-page">
  <div
    className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin"
    id="m_login"
  >
    <div className="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside">
      <div className="m-stack m-stack--hor m-stack--desktop">
        <div className="m-stack__item m-stack__item--fluid">
          <div className="m-login__wrapper">
            <div className="m-login__logo">
              <a href="#">
                <img src={logo} />
              </a>
            </div>
            <div className="m-login__signin">
              <div className="m-login__head">
                <h3 className="m-login__title">Sign In</h3>
              </div>
              {
                this.state.url &&
                <a href={this.state.url} style={btn} className="btn btn-danger m-btn m-btn--icon m-login__head m-login__title">
                   <span>
                     <i className="fa fa-google fa-fw" />
                     <span>
                       Login with Google
                     </span>
                   </span>
                 </a>
             }
            </div>
          </div>
        </div>
        <div className="m-stack__item m-stack__item--center">
          <div className="m-login__account"  style={{marginTop: '-90px'}}>
            <span className="m-login__account-msg">
              Don't have an account yet ?
            </span>
            &nbsp;&nbsp;
            <a
              href="/signup"
              id="m_login_signup"
              className="m-link m-link--focus m-login__account-link"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      className="m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1	m-login__content"
    style={{backgroundImage: `url(${background})`, minHeight: '100vh'}}
    >
      <div className="m-grid__item m-grid__item--middle">
        <h3 className="m-login__welcome">Join WLB</h3>
        <p className="m-login__msg">
          Manage your whatsapp groups and audience.
          <br />
          Invite them into whatsapp groups efficiently.
        </p>
      </div>
    </div>
  </div>
</div>
</div>
        );
    }
}
