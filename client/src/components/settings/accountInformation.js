import React, { Component } from "react";
import jwt_decode from 'jwt-decode'
import { Alert } from 'reactstrap';
import  { Redirect } from 'react-router-dom'

const axios = require('axios');
const auth = require('../../utility/auth.service.js')


export default class AccountInformation extends Component {
    constructor() {
        super();
        this.state = {
            fName: '',
            lName: '',
            email: '',
            phoneNo: '',
            messageDisplay: false,
            displayAlert : false,
            msg: {
                show: false,
                message: ''
            }
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
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

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }
    onSubmit(e) {
        e.preventDefault()
        const userId = auth.default.getUserId()
        const data = {
            firstname: this.state.fName,
            lastname: this.state.lName
        }
        if(data.firstname === '' || data.lastname === '') {
            this.setState({msg: {message: 'Fields can not be empty', show: true}})
        } else {
            axios.put(`/users/${userId}`,data,{
              headers: {
            "Authorization": `${auth.default.getToken()}`,
            "userId": `${auth.default.getUserId()}`
          }
            })
            .then(res => {
                console.log('update successfully', res)
                this.setState({msg: {message: '', show: false}})
                this.setState({displayAlert: true, messageDisplay:true}, ()=> {
                  setTimeout(() => {
                    this.setState({ displayAlert: false })
                  }, 3000);
                })
            })
            .catch(error => {
              if(error.response.status === 401){
                window.location.reload();
              }
                console.log(error)
                this.setState({displayAlert: true, messageDisplay:false}, ()=> {
                  setTimeout(() => {
                    this.setState({ displayAlert: false })
                  }, 3000);
                })
            })
        }
    }
    render() {
        return (

          <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
              <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-tools'>
                    <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                      <li className='nav-item m-tabs__item'>
                        <span className='nav-link m-tabs__link active'>
                          <i className='flaticon-share m--hide' />
                          Accounts Information
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='tab-content'>
                <form onSubmit={this.onSubmit}>
                  <div className="m-portlet__body">
                  <div className="form-group m-form__group row">
                    <label className="col-4 col-form-label" style={{textAlign: 'left'}}>First Name</label>
                    <div className="col-7 input-group">
                      <input
                        type="fName"
                        name="fName"
                        className="form-control m-input"
                        placeholder="First Name"
                        value={this.state.fName}
                        onChange={this.onChange}
                        disabled = {true} />
                        </div>
                  </div>
                  <div className="form-group m-form__group row">
                    <label className="col-4 col-form-label" style={{textAlign: 'left'}}>Last Name</label>
                    <div className="col-7 input-group">
                      <input
                        type="lName"
                        name="lName"
                        className="form-control m-input"
                        placeholder="Last Name"
                        value={this.state.lName}
                        onChange={this.onChange}
                        disabled = {true} />
                        </div>
                  </div>
                  <div className="form-group m-form__group row">
                    <label className="col-4 col-form-label" style={{textAlign: 'left'}}>Last Name</label>
                    <div className="col-7 input-group">
                      <input
                        type="email"
                        name="email"
                        className="form-control m-input"
                        placeholder="Email Address"
                        value={this.state.email}
                        disabled = {true} />
                        </div>
                  </div>
                  {this.state.phoneNo &&
                  <div className="form-group m-form__group row">
                    <label className="col-4 col-form-label" style={{textAlign: 'left'}}>Last Name</label>
                    <div className="col-7 input-group">
                      <input
                        type="phoneNo"
                        name="phoneNo"
                        className="form-control m-input"
                        placeholder="Phone Number"
                        value={this.state.phoneNo}
                        disabled = {true} />
                        </div>
                  </div>
                }
                <br></br>
                <br></br>
                <br></br>
                {this.state.msg.show &&
                  <Alert color='danger'>{this.state.msg.message}</Alert>
                }
                {this.state.displayAlert &&
                  <Alert color= {this.state.messageDisplay ? "success" : 'danger'}>{this.state.messageDisplay ? 'update information successfully': 'Failed to update Information'}</Alert>
                }
                  </div>
                </form>
                  <div className='tab-pane active' id='m_user_profile_tab_2' />
                </div>
              </div>
            </div>
        );
    }
}
