import React, { Component } from 'react';
import jwt_decode from 'jwt-decode'
const axios = require('axios');



export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            baseUrls: [],
        }
        this.logOut = this.logOut.bind(this);
    }

    componentDidMount() {
        if (!localStorage.userToken) {
            this.props.history.push('/sign-in')
        } else {
            const token = localStorage.userToken
            const decode = jwt_decode(token)
            console.log(decode)
            this.getUser(decode.userId)
            this.getUrl()
        }

    }

    logOut() {
        localStorage.removeItem('userToken')
    }

    getUser(userId) {
        const url = 'http://localhost:4200/'
        axios
            .get(`${url}users/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.userToken}`
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
                console.log(err)
            })
    }

    getUrl() {
        const url = 'http://localhost:4200/'
        axios
            .get(`${url}urls/`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.userToken}`
                }
            })
            .then(res => {
                let urls = res.data.payload
                let baseUrls = urls.filter(url => url.baseurl === 1)
                let count = 0;
                baseUrls.forEach(element => {
                    urls.map(x => {
                        if (x.baseUrlId === element.id) {
                            count++
                        }
                    })
                    element.alternetGroups = count
                    count = 0
                });
                this.setState({ baseUrls: baseUrls })

            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        console.log(this.state.baseUrls)
        return (
            <div className='row'>
                <div className='col-sm-12'>
                    <div className="btn-group dropleft" style={{ float: 'right', margin: '10px 10px 0px 0px' }}>
                        <button
                            className="btn"
                            type="button"
                            id="dropdownMenuButton"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false">
                            <span className="material-icons">
                                person
                        </span>
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <p className="dropdown-item" >{this.state.firstname} {this.state.lastname}</p>
                            <a className="dropdown-item" href="/#">User Profile</a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" onClick={this.logOut} href="/#">Log Out</a>
                        </div>
                    </div>
                </div>
                <div className='col-sm-12'>
                </div>
                <div className='col-sm-12'>
                <button type="button" style={{marginRight: '5%', marginBottom: '4px'}} className="btn btn-primary pull-right">Add URL</button>
                    <table className="table" style={{width: '90%', margin: '30px 0px 0px 5%'}}>
                        <thead>
                            <tr className="table-active">
                                <th scope="col">Base URL</th>
                                <th scope="col">Alternet Groups</th>
                                <th scope="col">Redirect Link</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.baseUrls.map(function(url, i){
                                    return(
                                        <tr key={i}>
                                        <td>{url.url}</td>
                                        <td>{url.alternetGroups}</td>
                                        <td>{url.redirectUrl}</td>
                                        <td>
                                            Copy Redirect URL, edit, delete, view
                                        </td>
                                    </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}