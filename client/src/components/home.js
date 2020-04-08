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
            addUrls: {
                baseUrl: "",
                count: 0,
                alternetUrl: []
            }
        }
        this.getUser = this.getUser.bind(this);
        this.getUrl = this.getUrl.bind(this);
        this.logOut = this.logOut.bind(this);
        this.changeBaseUrl = this.changeBaseUrl.bind(this);
        this.changeCount = this.changeCount.bind(this);
        this.addUrl = this.addUrl.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.alternetUrlChange = this.alternetUrlChange.bind(this);
        this.alternetCountChange = this.alternetCountChange.bind(this);
    }

    alternetCountChange(event, index) {
        console.log('temp count')
        let temp = this.state.addUrls
        temp.alternetUrl[index].count = event.target.value
        this.setState({ addUrls: temp })
    }

    alternetUrlChange(event, index) {
        let temp = this.state.addUrls
        temp.alternetUrl[index].url = event.target.value
        this.setState({ addUrls: temp })
    }

    addGroup() {
        let temp = this.state.addUrls
        let data = { url: '', count: '' }
        temp.alternetUrl.push(data)
        this.setState({ addUrls: temp })
    }

    addUrl() {
        console.log(this.state.addUrls)
    }
    changeBaseUrl(event) {
        let temp = this.state.addUrls
        temp.baseUrl = event.target.value
        this.setState({ addUrls: temp })
    }

    changeCount(event) {
        let temp = this.state.addUrls
        temp.count = event.target.value
        this.setState({ addUrls: temp })
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
        return (
            <span>
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
                                <a className="dropdown-item" href="/accountInformation">User Profile</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" onClick={this.logOut} href="/#">Log Out</a>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-12'>
                    </div>
                    <div className='col-sm-12'>
                        <button type="button" data-toggle="modal" data-target="#addUrl" style={{ marginRight: '5%', marginBottom: '4px' }} className="btn btn-primary pull-right">Add URL</button>
                        <table className="table" style={{ width: '90%', margin: '30px 0px 0px 5%' }}>
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
                                    this.state.baseUrls.map(function (url, i) {
                                        return (
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
                {/* <!-- Modal --> */}
                <div className="modal fade" tabIndex='-1' id="addUrl" role="dialog" aria-labelledby="addUrl" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Add Whatsapp Invitation URL</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className='row'>
                                    <div className='col-sm-8'>
                                        <div className="form-group">
                                            <label>Base Group URL</label>
                                            <input
                                                type="text"
                                                name="baseUrl"
                                                className="form-control"
                                                value={this.state.addUrls.baseUrl}
                                                onChange={this.changeBaseUrl}
                                                placeholder="Enter Base Group URL" />
                                        </div>
                                    </div>
                                    <div className='col-sm-4'>
                                        <div className="form-group">
                                            <label>Participent Count</label>
                                            <input
                                                type="number"
                                                name="count"
                                                className="form-control"
                                                value={this.state.addUrls.count}
                                                onChange={this.changeCount}
                                                placeholder="Count" />
                                        </div>
                                    </div>
                                    <div className='col-sm-12'>
                                        <label>Alternet Groups</label>
                                    </div>
                                    {
                                        this.state.addUrls.alternetUrl.map(function (item, i) {
                                            return (
                                                <span className='col-sm-12' key={i}>
                                                    <div className='row'>
                                                        <div className='col-sm-8'>
                                                            <div className="form-group">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={item.url}
                                                                    onChange={(e)=>{this.alternetUrlChange(e, i)}}
                                                                    placeholder="Enter Alterner Group URL" />
                                                            </div>
                                                        </div>
                                                        <div className='col-sm-4'>
                                                            <div className="form-group">
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={item.count}
                                                                    onChange={(e)=>{this.alternetCountChange(e, i)}}
                                                                    placeholder="Count" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </span>
                                            )
                                        })
                                    }
                                    <div className='col-sm-12'>
                                        <button type="button" className="btn btn-secondary" onClick={this.addGroup}>Add Group</button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.addUrl}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        );
    }
}