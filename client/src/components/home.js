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
            },
            toBeDelete: {},
            toBeAdd: {}
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
        this.deleteAtlernetUrl = this.deleteAtlernetUrl.bind(this)
        this.deleteUrl = this.deleteUrl.bind(this)
        this.toBeDelete = this.toBeDelete.bind(this)
        this.toBeEdit = this.toBeEdit.bind(this)
        this.editURL = this.editURL.bind(this)
        this.toBeAdd = this.toBeAdd.bind(this)
        this.copyUrl = this.copyUrl.bind(this)
    }

    copyUrl(url) {
        var para = document.createElement("TEXTAREA");
        para.value = url.redirectUrl;
        para.setAttribute('readonly', '');
        para.style.position = 'absolute';
        para.style.left = '-9999px';
        document.body.appendChild(para);
        para.select()
        document.execCommand("copy");
        document.body.removeChild(para);
        this.setState({ copied: true })
    }

    toBeAdd() {
        this.setState({
            addUrls: {
                baseUrl: "",
                count: 0,
                alternetUrl: []
            }
        })
    }

    editURL() {
        this.setState({ deleteAlert: false })
        axios
            .put('/urls/', this.state.addUrls, {
                headers: {
                    "Authorization": `Bearer ${localStorage.userToken}`
                }
            })
            .then(res => {
                this.setState({
                    addUrls: {
                        baseUrl: "",
                        count: 0,
                        alternetUrl: []
                    }
                })
                setTimeout(() => { this.getUrl() }, 500)
            })
            .catch(err => {
            })
    }

    toBeEdit(url) {
        axios
            .get(`/urls/${url.id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.userToken}`
                },
            })
            .then(res => {
                let data = {
                    baseUrl: '',
                    count: 0,
                    id: 0,
                    alternetUrl: []
                }
                res.data.payload.forEach(element => {
                    if (!element.baseUrlId) {
                        data.baseUrl = element.url
                        data.count = element.participentCount
                        data.id = element.id
                    } else {
                        let temp = { id: element.id, url: element.url, count: element.participentCount }
                        data.alternetUrl.push(temp)
                    }
                })
                this.setState({ addUrls: data })
            })
            .catch(err => {
                console.log(err)
            })
    }

    deleteUrl() {
        axios
            .delete('/urls/', {
                headers: {
                    "Authorization": `Bearer ${localStorage.userToken}`
                },
                data: this.state.toBeDelete
            })
            .then(res => {
                console.log(this.state.toBeDelete)
                console.log(res)
                this.setState({ toBeDelete: {}, deleteAlert: true })
                this.getUrl()
            })
            .catch(err => {
                console.log(err)
            })

    }

    toBeDelete(url) {
        console.log(url)
        this.setState({ toBeDelete: url })
        console.log(this.state.toBeDelete)
    }

    deleteAtlernetUrl(index) {
        let temp = this.state.addUrls
        temp.alternetUrl.splice(index, 1)
        this.setState({ addUrls: temp })
    }

    alternetCountChange(index, event) {
        let temp = this.state.addUrls
        temp.alternetUrl[index].count = event.target.value
        this.setState({ addUrls: temp })
    }

    alternetUrlChange(index, event) {
        let temp = this.state.addUrls
        temp.alternetUrl[index].url = event.target.value
        this.setState({ addUrls: temp })
    }

    addGroup() {
        let temp = this.state.addUrls
        let data = { url: '', count: 0 }
        temp.alternetUrl.push(data)
        this.setState({ addUrls: temp })
    }

    addUrl() {
        axios
            .post(`/urls/`, this.state.addUrls, {
                headers: {
                    "Authorization": `Bearer ${localStorage.userToken}`
                }
            })
            .then(res => {
                this.setState({ addUrls: { baseUrl: "", count: 0, alternetUrl: [] } })
                this.setState({ deleteAlert: false })
                this.getUrl()
            })
            .catch(err => {
                console.log(err)
            })

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
            this.getUser(decode.userId)
            this.setState({ deleteAlert: false })
            this.getUrl()
        }

    }

    logOut() {
        localStorage.removeItem('userToken')
    }

    getUser(userId) {
        axios
            .get(`/users/${userId}`, {
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
        axios
            .get(`/urls/`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.userToken}`
                }
            })
            .then(res => {
                let urls = res.data.payload
                let baseUrls = urls.filter(url => url.baseurl === 1)
                baseUrls.forEach((element) => {
                    let showRedirectUrl = false
                    let alternetUrls = urls.filter(url => (url.baseUrlId === element.id))
                    if (element.participentCount < 250) {
                        showRedirectUrl = true
                    }
                    alternetUrls.forEach(atlernetUrl => {
                        if (atlernetUrl.participentCount < 250) {
                            showRedirectUrl = true
                        }
                    })
                    if (showRedirectUrl) {
                        let webUrl = window.location.href.split('/');
                        if (webUrl[2].split(':')[1] && webUrl[2].split(':')[1].length > 0) {
                            element.redirectUrl = webUrl[0] + '//' + webUrl[2].split(':')[0] + ':8080' + element.redirectUrl
                        } else {
                            element.redirectUrl = webUrl[0] + '//' + webUrl[2] + element.redirectUrl
                        }
                        this.setState({ showRedirectUrl: true })
                    } else {
                        this.setState({ showRedirectUrl: false })
                        element.redirectUrl = 'Groups are full'
                    }
                    // if(alternetUrl.length > 0)
                    let count = alternetUrls.length
                    element.alternetGroups = count
                });
                console.log(baseUrls)
                this.setState({ baseUrls: baseUrls, copied: false })

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
                    <div className='col-sm-12' style={{ marginRight: '5%', marginBottom: '4px' }}>
                        {this.state.deleteAlert &&
                            <div className="alert alert-success" role="alert">
                                Deleted URL Successfully!
                        </div>
                        }
                    </div>
                    <div className='col-sm-12' style={{ marginRight: '5%', marginBottom: '4px' }}>
                        {this.state.copied &&
                            <div className="alert alert-primary" role="alert">
                                Redirect Link Copied!
                        </div>
                        }
                    </div>
                    <div className='col-sm-12'>
                        <button type="button"
                            data-toggle="modal"
                            data-target="#addUrl"
                            style={{ marginRight: '5%', marginBottom: '4px' }}
                            className="btn btn-primary pull-right"
                            onClick={this.toBeAdd}>
                            Add URL
                        </button>
                        <table className="table" style={{ width: '90%', margin: '30px 0px 0px 5%' }}>
                            <thead>
                                <tr className="table-active">
                                    <th scope="col">Base URL</th>
                                    <th scope="col">Alternet Groups</th>
                                    <th scope="col">Redirect Link</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            {this.state.baseUrls.length > 0
                                ? <tbody>
                                    {
                                        this.state.baseUrls.map((url, i) =>
                                            (
                                                <tr key={i}>
                                                    <td>{url.url}</td>
                                                    <td>{url.alternetGroups}</td>
                                                    <td>{url.redirectUrl}</td>
                                                    <td>
                                                        {this.state.showRedirectUrl
                                                            &&
                                                            <a href='/#'
                                                                data-placement="bottom"
                                                                title="Copy Redirect URL"
                                                                style={{ margin: '2px' }}
                                                                onClick={() => this.copyUrl(url)}>
                                                                <span className="badge badge-pill badge-info">
                                                                    <span className="material-icons">
                                                                        file_copy
                                                                </span>
                                                                </span>
                                                            </a>
                                                        }
                                                        <a href='/#'
                                                            data-toggle="modal"
                                                            data-target="#edit"
                                                            data-placement="bottom"
                                                            title="Edit this URL"
                                                            style={{ margin: '2px' }}
                                                            onClick={() => this.toBeEdit(url)}>
                                                            <span className="badge badge-pill badge-info">
                                                                <span className="material-icons">
                                                                    edit
                                                        </span>
                                                            </span>
                                                        </a>
                                                        <a href='/#'
                                                            style={{ margin: '2px' }}
                                                            onClick={() => this.toBeDelete(url)}
                                                            data-toggle="modal"
                                                            data-target="#delete"
                                                            data-placement="bottom"
                                                            title="Delete this url" >
                                                            <span className="badge badge-pill badge-danger">
                                                                <span className="material-icons">
                                                                    delete_outline
                                                        </span>
                                                            </span>
                                                        </a>
                                                    </td>
                                                </tr>
                                            )
                                        )

                                    }
                                </tbody>
                                : <tbody>
                                    <tr>
                                        <td>No data to display</td>
                                    </tr>
                                </tbody>

                            }

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
                                        this.state.addUrls.alternetUrl.map((item, i) =>
                                            (
                                                <span className='col-sm-12' key={i}>
                                                    <div className='row'>
                                                        <div className='col-sm-6'>
                                                            <div className="form-group">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={item.url}
                                                                    onChange={(e) => this.alternetUrlChange(i, e)}
                                                                    placeholder="Enter Alterner Group URL" />
                                                            </div>
                                                        </div>
                                                        <div className='col-sm-4'>
                                                            <div className="form-group">
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={item.count}
                                                                    onChange={(e) => this.alternetCountChange(i, e)}
                                                                    placeholder="Count" />
                                                            </div>
                                                        </div>
                                                        <div className='col-sm-2'>
                                                            <button type="button" className="btn btn-danger" style={{ height: '37px' }}
                                                                onClick={() => this.deleteAtlernetUrl(i)}>
                                                                <span className="material-icons">
                                                                    delete_forever
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </span>
                                            )
                                        )
                                    }
                                    <div className='col-sm-12'>
                                        <button type="button" className="btn btn-secondary" onClick={this.addGroup}>Add Group</button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.addUrl}>Add URL</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* delete modal */}
                <div className="modal fade" id="delete" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Delete Confirmation</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete ?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.deleteUrl}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- edit Modal --> */}
                <div className="modal fade" tabIndex='-1' id="edit" role="dialog" aria-labelledby="addUrl" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Edit Whatsapp Invitation URL</h5>
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
                                        this.state.addUrls.alternetUrl.map((item, i) =>
                                            (
                                                <span className='col-sm-12' key={i}>
                                                    <div className='row'>
                                                        <div className='col-sm-6'>
                                                            <div className="form-group">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={item.url}
                                                                    onChange={(e) => this.alternetUrlChange(i, e)}
                                                                    placeholder="Enter Alterner Group URL" />
                                                            </div>
                                                        </div>
                                                        <div className='col-sm-4'>
                                                            <div className="form-group">
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={item.count}
                                                                    onChange={(e) => this.alternetCountChange(i, e)}
                                                                    placeholder="Count" />
                                                            </div>
                                                        </div>
                                                        <div className='col-sm-2'>
                                                            <button type="button" className="btn btn-danger" style={{ height: '37px' }}
                                                                onClick={() => this.deleteAtlernetUrl(i)}>
                                                                <span className="material-icons">
                                                                    delete_forever
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </span>
                                            )
                                        )
                                    }
                                    <div className='col-sm-12'>
                                        <button type="button" className="btn btn-secondary" onClick={this.addGroup}>Add Group</button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.editURL}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        );
    }

}
