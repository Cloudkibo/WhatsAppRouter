import React from 'react'
import { Link } from 'react-router-dom'
import AccountInformation from './accountInformation'

const axios = require('axios');
const auth = require('../../utility/auth.service.js')


class Settings extends React.Component {
    constructor() {
        super();
        this.state = {
          fName: '',
          lName: '',
          email: '',
          phoneNo: '',
          openTab:'accountsInfo'
        }
        this.accountsInfo = this.accountsInfo.bind(this)

    }

  accountsInfo () {
    this.setState({
      openTab: 'accountsInfo'
    })
  }

  componentDidMount() {
    if (auth.default.getUserId()) {
      const userId = auth.default.getUserId()
      axios.get(`/users/${userId}`,{
        headers: {
          "Authorization": `${auth.default.getToken()}`,
          "userId": `${auth.default.getUserId()}`
        }
      })
      .then(res => {
        let payload = res.data.payload[0]
        this.setState({fName: payload.firstname, lName: payload.lastname, phoneNo: payload.phone, email: payload.email})
      })
      .catch(error => {
        if(error.response.status === 401){
          window.location.reload();
        }
        console.log(error)
      })
    }
  }

    render() {
        return (
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Settings</h3>
                </div>
              </div>
            </div>
            <div className="m-content">
              <div className='row'>
                 <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
                  <div className='m-portlet m-portlet--full-height'>
                    <div className='m-portlet__body'>
                      <div className='m-card-profile'>
                        <div className='m-card-profile__title m--hide'>
                          Your Profile
                        </div>
                        <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} className='m-card-profile__details'>
                          <span className='m-card-profile__name'>
                            {this.state.fName} {this.state.lName}
                          </span>
                          <span className='m-card-profile__email'>
                            {this.state.email}
                          </span>
                        </div>
                      </div>
                       <ul className='m-nav m-nav--hover-bg m-portlet-fit--sides'>
                         <li className='m-nav__separator m-nav__separator--fit' />
                         <li className='m-nav__section m--hide'>
                          <span className='m-nav__section-text'>Section</span>
                         </li>
                         <li className='m-nav__item'>
                          <a href='#/' className='m-nav__link' onClick={this.accountsInfo} style={{cursor: 'pointer'}} >
                          <i className='m-nav__link-icon flaticon-lock-1' />
                            <span className='m-nav__link-text'>Accounts Information</span>
                          </a>
                         </li>
                       </ul>
                    </div>
                  </div>
                 </div>
                 { this.state.openTab === 'accountsInfo' &&
                  <AccountInformation history= {this.props.history} />
                  }
              </div>
            </div>
          </div>
        );
    }
}

export default Settings
