import React, {Component} from 'react'
import { Link } from 'react-router-dom'

class Sidebar extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  showManageUrls () {
    return (
      <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
        <Link to='/home' className='m-menu__link m-menu__toggle'>
          <i className='m-menu__link-icon flaticon-statistics' title='Operational Dashboard' />
          <span className='m-menu__link-text'>Manage Urls</span>
        </Link>
      </li>
    )
  }

  showDashboard () {
    return (
      <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
        <Link to='/' className='m-menu__link m-menu__toggle'>
          <i className='m-menu__link-icon flaticon-squares-4' title='Dashboard' />
          <span className='m-menu__link-text'>Dashboard</span>
        </Link>
      </li>
    )
  }


  showNestedMenu () {
    return (
      <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
        <a href='#/' className='m-menu__link m-menu__toggle'>
          <i className='m-menu__link-icon flaticon-users' title='Subscriptions' />
          <span className='m-menu__link-text'>Main Item</span>
          <i className='m-menu__ver-arrow la la-angle-right' />
        </a>
        <div className='m-menu__submenu'>
          <span className='m-menu__arrow' />
          <ul className='m-menu__subnav'>
            <li className='m-menu__item  m-menu__item--parent' aria-haspopup='true' >
              <a href='#/' className='m-menu__link'>
                <span className='m-menu__link-text'>
                  Main Item
                </span>
              </a>
            </li>
            <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
              <Link to='/' className='m-menu__link m-menu__toggle'>
                <i className='m-menu__link-icon flaticon-user-ok' title='Subscribers' />
                <span className='m-menu__link-text'>Nested Item 1</span>
              </Link>
            </li>
            <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
              <Link to='/' className='m-menu__link m-menu__toggle'>
                <i className='m-menu__link-icon flaticon-user-ok' title='Subscribers' />
                <span className='m-menu__link-text'>Nested Item 2</span>
              </Link>
            </li>
            <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
              <Link to='/' className='m-menu__link m-menu__toggle'>
                <i className='m-menu__link-icon flaticon-user-ok' title='Subscribers' />
                <span className='m-menu__link-text'>Nested Item 3</span>
              </Link>
            </li>
          </ul>
        </div>
      </li>
    )
  }

  showAccountInformation () {
    return (
      <li className='m-menu__item' aria-haspopup='true' >
        <Link to='/accountInformation' className='m-menu__link'>
          <i className='m-menu__link-icon fa fa-id-card-o'>
            <span />
          </i>
          <span className='m-menu__link-text'>
            Account Information
          </span>
        </Link>
      </li>
    )
  }

  showSettings () {
    return (
      <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
        <Link to='/' className='m-menu__link m-menu__toggle'>
          <i className='m-menu__link-icon flaticon-cogwheel' title='Settings' />
          <span className='m-menu__link-text'>Settings</span>
        </Link>
      </li>
    )
  }

  showUserGuide () {
    return (
      <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
        <a href='http://kibopush.com/user-guide/' target='_blank' rel='noopener noreferrer' className='m-menu__link m-menu__toggle'>
          <i className='m-menu__link-icon flaticon-info' title='User Guide' />
          <span className='m-menu__link-text'>User Guide</span>
        </a>
      </li>
    )
  }

  render () {
    return (
      <div id='sidebarDiv'>
        <button className='m-aside-left-close  m-aside-left-close--skin-dark ' id='m_aside_left_close_btn'>
          <i className='la la-close' />
        </button>
        <div id='m_aside_left' className='m-grid__item m-aside-left  m-aside-left--skin-dark'>
          <div
            id='m_ver_menu'
            className='m-aside-menu  m-aside-menu--skin-dark m-aside-menu--submenu-skin-dark m-scroller mCustomScrollbar _mCS_2 mCS-autoHide'
            data-menu-vertical='1'
            data-menu-scrollable='1'
          >
            <div id='mCSB_2' className='mCustomScrollBox mCS-minimal-dark mCSB_vertical mCSB_outside' tabIndex='0' style={{maxHeight: 'none'}}>
              <div id='mCSB_2_container' className='mCSB_container' style={{position: 'relative', top: '0px', left: '0px'}} dir='ltr'>
                <ul className='m-menu__nav  m-menu__nav--dropdown-submenu-arrow '>
                  {this.showDashboard()}
                  {this.showManageUrls()}
                  {this.showNestedMenu()}
                  {this.showAccountInformation()}
                  {this.showSettings()}
                  {this.showUserGuide()}
                </ul>
              </div>
            </div>
            <div id='mCSB_2_scrollbar_vertical' className='mCSB_scrollTools mCSB_2_scrollbar mCS-minimal-dark mCSB_scrollTools_vertical' style={{display: 'block'}}>
              <div className='mCSB_draggerContainer'>
                <div id='mCSB_2_dragger_vertical' className='mCSB_dragger' style={{position: 'absolute', minHeight: '50px', display: 'block', maxHeight: '303px', top: '0px'}}>
                  <div className='mCSB_dragger_bar' style={{lineHeight: '50px'}} />
                </div>
                <div className='mCSB_draggerRail' />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Sidebar
