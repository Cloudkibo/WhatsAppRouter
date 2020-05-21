import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
const auth = require('../../utility/auth.service.js')
const axios = require('axios');



class Header extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      firstname: '',
      lastname: '',
      email: ''
    }
      this.getUser = this.getUser.bind(this);
      this.logOut = this.logOut.bind(this);
  }

  getUser(userId) {
      axios
          .get(`/users/${userId}`, {
            headers: {
          "Authorization": `${auth.default.getToken()}`,
          "userId": `${auth.default.getUserId()}`
        }
          })
          .then(res => {
              this.setState({
                  firstname: res.data.payload[0].firstname,
                  lastname: res.data.payload[0].lastname,
                  email: res.data.payload[0].email
              })
          })
          .catch(err => {
            if(err.response.status === 401){
              window.location.reload();
            }
              console.log(err)
          })
  }

  logOut() {
      auth.default.logout()
      window.location.reload();
  }

  componentDidMount () {
    if (auth.default.getUserId()) {
          const userId = auth.default.getUserId()
          this.getUser(userId)
        }
  }

  render () {
    return (
      <header id='headerDiv' className='m-grid__item m-header ' data-minimize-offset='200' data-minimize-mobile-offset='200' >
        <div className='m-container m-container--fluid m-container--full-height'>
          <div className='m-stack m-stack--ver m-stack--desktop'>
            <div className='m-stack__item m-brand  m-brand--skin-dark '>
              <div className='m-stack m-stack--ver m-stack--general'>
                <div className='m-stack__item m-stack__item--middle m-brand__logo'>
                  <h4 className='m-brand__logo-wrapper' style={{ color: 'white' }}>
                    {<img alt='' style={{width: '35px'}} src={logo}/>}
                    WLB</h4>
                </div>
                <div className='m-stack__item m-stack__item--middle m-brand__tools'>
                  <a href='#/' id='m_aside_left_minimize_toggle' className='m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-desktop-inline-block'>
                    <span />
                  </a>
                  <a href='#/' id='m_aside_left_offcanvas_toggle' className='m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-tablet-and-mobile-inline-block'>
                    <span />
                  </a>

                  <a id='m_aside_header_menu_mobile_toggle' href='#/' className='m-brand__icon m-brand__toggler m--visible-tablet-and-mobile-inline-block'>
                    <span />
                  </a>

                  <a id='m_aside_header_topbar_mobile_toggle' href='#/' className='m-brand__icon m--visible-tablet-and-mobile-inline-block'>
                    <i className='flaticon-more' />
                  </a>
                </div>
              </div>
            </div>
            <div className='m-stack__item m-stack__item--fluid m-header-head' id='m_header_nav'>
              <button className='m-aside-header-menu-mobile-close  m-aside-header-menu-mobile-close--skin-dark ' id='m_aside_header_menu_mobile_close_btn'>
                <i className='la la-close' />
              </button>
              <div id='m_header_topbar' className='m-topbar  m-stack m-stack--ver m-stack--general'>
                <div className='m-stack__item m-topbar__nav-wrapper'>
                  <ul className='m-topbar__nav m-nav m-nav--inline'>
                    <li className='m-nav__item m-topbar__user-profile m-topbar__user-profile--img  m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
                      <a href='#/' className='m-nav__link m-dropdown__toggle'>
                        <span className='m-topbar__userpic'>
                          <div style={{ display: 'inline-block', marginRight: '5px' }}>
                            <img src='https://cdn.cloudkibo.com/public/icons/users.jpg' className='m--img-rounded m--marginless m--img-centered' alt='user-profile-pic' />
                          </div>
                          <div style={{ display: 'inline-block', height: '41px' }}>
                            <span className='m-nav__link-text' style={{ lineHeight: '41px', verticalAlign: 'middle', textAlign: 'center' }}>
                              {`${this.state.firstname} ${this.state.lastname}`} <i className='fa fa-chevron-down' />
                            </span>
                          </div>
                        </span>
                      </a>
                      <div className='m-dropdown__wrapper'>
                        <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                        <div className='m-dropdown__inner'>
                          <div className='m-dropdown__header m--align-center'>
                            <div className='m-card-user m-card-user--skin-dark'>
                              <div className='m-card-user__pic'>
                                <img src='https://cdn.cloudkibo.com/public/icons/users.jpg' className='m--img-rounded m--marginless' alt='user-profile-pic' />
                              </div>
                              <div className='m-card-user__details'>
                                <span className='m-card-user__name m--font-weight-500'>
                                  {`${this.state.firstname} ${this.state.lastname}`}
                                </span>
                                <span className='m-card-user__email'>
                                  {`${this.state.email}`}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='m-dropdown__body'>
                            <div className='m-dropdown__content'>
                              <ul className='m-nav m-nav--skin-light'>
                                <li className='m-nav__item'>
                                  <a href='http://kibopush.com/faq/' target='_blank' rel='noopener noreferrer' className='m-nav__link'>
                                    <i className='m-nav__link-icon flaticon-info' />
                                    <span className='m-nav__link-text'>FAQs</span>
                                  </a>
                                </li>
                                <li className='m-nav__item'>
                                  <Link to='/settings'>
                                    <i className='m-nav__link-icon flaticon-settings' />
                                    <span className='m-nav__link-text'>&nbsp;&nbsp;&nbsp;Settings</span>
                                  </Link>
                                </li>
                                <li className='m-nav__separator m-nav__separator--fit' />
                                <li className='m-nav__item'>
                                  <a href='#/' onClick={this.logOut} className='btn m-btn--pill btn-secondary m-btn m-btn--custom m-btn--label-brand m-btn--bolder'>
                                    Logout
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export default Header
