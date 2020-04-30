import React, { Component } from "react";
import jwt_decode from 'jwt-decode'
import { Alert } from 'reactstrap';
import  { Redirect } from 'react-router-dom'

const axios = require('axios');
const auth = require('../utility/auth.service.js')


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
                this.setState({displayAlert: true, messageDisplay:true})
            })
            .catch(error => {
              if(error.response.status === 401){
                window.location.reload();
              }
                console.log(error)
                this.setState({displayAlert: true, messageDisplay:false})
            })
        }
    }
    render() {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.onSubmit}>
                        <h3>Account Information</h3>
                        <div className="form-group">
                            <input
                                type="fName"
                                name="fName"
                                className="form-control"
                                placeholder="fName"
                                value={this.state.fName}
                                onChange={this.onChange} />

                        </div>
                        <div className="form-group">
                            <input
                                type="lName"
                                name="lName"
                                className="form-control"
                                placeholder="lName"
                                value={this.state.lName}
                                onChange={this.onChange} />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="email"
                                value={this.state.email}
                                disabled = {true}
                                 />
                        </div>
                        {this.state.phoneNo &&
                          <div className="form-group">
                              <input
                                  type="phoneNo"
                                  name="phoneNo"
                                  className="form-control"
                                  placeholder="PhoneNo"
                                  value={this.state.phoneNo}
                                  disabled = {true}
                                   />
                          </div>
                        }
                        <br></br>
                        <button style = {{marginLeft: '68px'}} type="submit" className="btn btn-primary">Edit</button>
                          <a  style = {{marginLeft: '35px'}} className="btn btn-secondary" href='/home'>Back</a>
                         <br></br>
                         <br></br>
                         {this.state.msg.show &&
                        <Alert color='danger'>{this.state.msg.message}</Alert>
                         }
                         {this.state.displayAlert &&
                        <Alert color= {this.state.messageDisplay ? "success" : 'danger'}>{this.state.messageDisplay ? 'update information successfully': 'Failed to update Information'}</Alert>
                         }
                    </form>
                </div>
            </div>
        );
    }
}
