import React, { Component } from "react";
import jwt_decode from 'jwt-decode'
import { Alert } from 'reactstrap';
const axios = require('axios');
const proxy = 'http://localhost:4200/'
export default class accountInformation extends Component {
    constructor() {
        super();
        this.state = {
            fName: '',
            lName: '',
            email: '',
            phoneNo: '',
            messageDisplay: false,
            displayAlert : false
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount() {
        if(!localStorage.userToken){
            this.props.history.push('/sign-in')
        } else {
            const token = localStorage.userToken
            const decode = jwt_decode(token)
            console.log(decode)
        axios.get(`${proxy}users/${decode.userId}`, {
            headers: {
            "Authorization": `Bearer ${localStorage.userToken}`
            }
            })
        .then(res => {
            let payload = res.data.payload[0]
            this.setState({fName: payload.firstname, lName: payload.lastname, phoneNo: payload.phone, email: payload.email})
        })
        .catch(error => {
            console.log(error)
        })
    } 
}

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }
    onSubmit(e) {
        e.preventDefault()
        const token = localStorage.userToken
        const decode = jwt_decode(token)
        const data = {
            firstname: this.state.fName,
            lastname: this.state.lName
        }
        axios.put(`${proxy}users/${decode.userId}`,data,{
            headers: {
            "Authorization": `Bearer ${localStorage.userToken}`
            }
            })
        .then(res => {
            console.log('update successfully', res)
            this.setState({displayAlert: true, messageDisplay:true})
        })
        .catch(error => {
            console.log(error)
            this.setState({displayAlert: true, messageDisplay:false})
        })
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
                        <br></br>
                        <button style = {{marginLeft: '68px'}} type="submit" className="btn btn-primary">Edit</button>
                        <button  style = {{marginLeft: '35px'}} className="btn btn-secondary" onClick={() => {this.props.history.push('/home')}}>Back</button>
                         <br></br>
                         <br></br>
                         {this.state.displayAlert && 
                        <Alert color= {this.state.messageDisplay ? "success" : 'danger'}>{this.state.messageDisplay ? 'update information successfully': 'Failed to update Information'}</Alert>
                         }
                    </form>
                </div>
            </div>
        );
    }
}