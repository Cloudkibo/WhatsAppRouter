import React, { Component } from 'react';
import jwt_decode from 'jwt-decode'
const axios = require('axios');
const BitlyClient = require('bitly').BitlyClient;
const bitly = new BitlyClient('4e26e6edc4f5f7145e9bf33d728083c0decdf12b');
const auth = require('../utility/auth.service.js')

export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            allUrls: [],
            baseUrls: [],
            dataForSearch: [],
            addUrls: {
                name: "",
                baseUrl: "",
                count: 0,
                alternetUrl: []
            },
            toBeDelete: {},
            toBeAdd: {},
            msg: {
                message: '',
                show: false
            },
            toBeAlternetDelete: 0,
            confirmEmail: '',
            wrongEmail: false,
            alternetUrlChangeIndex: 0,
            toBeEdit: {},
            tobeEditIndex: {
              baseGroupUrlChanged: false,
              alternetUrlChange: []
            }
        }
        this.getUser = this.getUser.bind(this);
        this.getUrl = this.getUrl.bind(this);
        this.logOut = this.logOut.bind(this);
        this.changeBaseUrl = this.changeBaseUrl.bind(this);
        this.changeBaseName = this.changeBaseName.bind(this)
        this.changeCount = this.changeCount.bind(this);
        this.addUrl = this.addUrl.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.alternetUrlChange = this.alternetUrlChange.bind(this);
        this.alternetNameChange = this.alternetNameChange.bind(this)
        this.alternetCountChange = this.alternetCountChange.bind(this);
        this.deleteAtlernetUrl = this.deleteAtlernetUrl.bind(this)
        this.deleteUrl = this.deleteUrl.bind(this)
        this.toBeDelete = this.toBeDelete.bind(this)
        this.toBeEdit = this.toBeEdit.bind(this)
        this.editURL = this.editURL.bind(this)
        this.toBeAdd = this.toBeAdd.bind(this)
        this.copyUrl = this.copyUrl.bind(this)
        this.disable = this.disable.bind(this)
        this.toBeAlternetDelete = this.toBeAlternetDelete.bind(this)
        this.confirmEmail = this.confirmEmail.bind(this)
        this.getGroupID = this.getGroupID.bind(this)
        this.search = this.search.bind(this)
        this.isUniqueURL = this.isUniqueURL.bind(this)
        this.validateCount = this.validateCount.bind(this)
        this.validateName = this.validateName.bind(this)
        this.validateUrl = this.validateUrl.bind(this)
        this.validateAlternateGroups = this.validateAlternateGroups.bind(this)
    }

    search(event) {
        if (this.state.dataForSearch.length > 0) {
            let searchArray = []
            if (event.target.value !== '') {
                this.state.dataForSearch.forEach(element => {
                    if (element.name.toLowerCase().includes(event.target.value.toLowerCase())) searchArray.push(element)
                })
                this.setState({ baseUrls: searchArray })
            } else {
                this.getUrl()
            }
        }
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

    editURL() {
        this.setState({ deleteAlert: false, createAlert: false })
        axios
            .put('/urls/', this.state.addUrls, {
              headers: {
            "Authorization": `${auth.default.getToken()}`,
            "userId": `${auth.default.getUserId()}`
          }
            })
            .then(res => {
                this.setState({
                    addUrls: {
                        name: "",
                        baseUrl: "",
                        count: 0,
                        alternetUrl: []
                    },
                    editAlert: true
                })
                document.getElementById('edit').click()
                setTimeout(() => { this.getUrl() }, 500)
            })
            .catch(err => {
              if(err.response.status === 401){
                window.location.reload();
              }
            })
    }

    toBeEdit(url) {
      this.setState({
        msg: {
            message: '',
            show: false
        },
        alternetUrlChangeIndex: 0,
        toBeEdit: {},
         addUrls: {
            name: "",
            baseUrl: "",
            count: 0,
            alternetUrl: []
        }
      })
        axios
            .get(`/urls/${url.id}`, {
              headers: {
            "Authorization": `${auth.default.getToken()}`,
            "userId": `${auth.default.getUserId()}`
          }
            })
            .then(res => {
                let data = {
                    name: '',
                    baseUrl: '',
                    count: 0,
                    id: 0,
                    alternetUrl: []
                }
                res.data.payload.forEach(element => {
                    if (!element.baseUrlId) {
                        data.name = element.name
                        data.baseUrl = element.url
                        data.count = element.participentCount
                        data.id = element.id
                    } else {
                        let temp = { id: element.id, name: element.name, url: element.url, count: element.participentCount }
                        data.alternetUrl.push(temp)
                    }
                })
                this.setState({
                    addUrls: data,
                    toBeEdit: JSON.parse(JSON.stringify(data))
                })
            })
            .catch(err => {
              if(err.response.status === 401){
                window.location.reload();
              }
                console.log(err)
            })
    }

    deleteUrl() {
        if (this.state.email.toLowerCase() === this.state.confirmEmail.toLowerCase()) {
            axios
                .delete('/urls/', {
                  headers: {
                "Authorization": `${auth.default.getToken()}`,
                "userId": `${auth.default.getUserId()}`
                },
                  data: this.state.toBeDelete
                })
                .then(res => {
                    this.getUrl()
                    this.setState({ toBeDelete: {}, deleteAlert: true, editAlert: false, createAlert: false, wrongEmail: false, confirmEmail: '' })
                    document.getElementById('delete').click()
                })
                .catch(err => {
                  if(err.response.status === 401){
                    window.location.reload();
                  }
                    console.log(err)
                })
        } else {
            this.setState({ wrongEmail: true })
        }
    }

    toBeDelete(url) {
        this.setState({ toBeDelete: url, wrongEmail: false, confirmEmail: '' })
    }

    deleteAtlernetUrl(index) {
        if (index < 0) {
            if (this.state.email.toLowerCase() === this.state.confirmEmail.toLowerCase()) {
                let temp = this.state.addUrls
                temp.alternetUrl.splice(this.state.toBeAlternetDelete, 1)
                this.setState({ addUrls: temp })
                document.getElementById('alternetDelete').click()
                this.setState({ wrongEmail: false, confirmEmail: '',   msg: {
                      message: '',
                      show: false
                  }})
            } else {
                this.setState({ wrongEmail: true, msg: {
                      message: '',
                      show: false
                  }})
            }
        } else {
            let temp = this.state.addUrls
            temp.alternetUrl.splice(index, 1)
            this.setState({ addUrls: temp,   msg: {
                  message: '',
                  show: false
              }})
        }
    }

    confirmEmail(e) {
        this.setState({ confirmEmail: e.target.value })
    }


    toBeAlternetDelete(index) {
      if(this.state.addUrls.alternetUrl[index].url === '') {
        let temp = this.state.addUrls
        temp.alternetUrl.splice(index, 1)
        this.setState({ addUrls: temp, msg: {
              message: '',
              show: false
          } })
       } else {
        console.log('i am here')
        this.setState({ toBeAlternetDelete: index, wrongEmail: false, confirmEmail: '',msg: {
              message: '',
              show: false
          } })
      }
    }

    alternetCountChange(index, event) {
        let temp = this.state.addUrls
        temp.alternetUrl[index].count = event.target.value
        this.setState({ addUrls: temp })
    }

    alternetUrlChange(index, event) {
        let temp = this.state.addUrls
        temp.alternetUrl[index].url = event.target.value
        let data = this.state.tobeEditIndex
        if(data.alternetUrlChange.indexOf(index) === -1){
          data.alternetUrlChange.push(index)
        }
        this.setState({ addUrls: temp, alternetUrlChangeIndex: index, tobeEditIndex: data})
    }

    alternetNameChange(index, event) {
        let temp = this.state.addUrls
        temp.alternetUrl[index].name = event.target.value
        this.setState({ addUrls: temp, alternetUrlChangeIndex: index })
    }

    addGroup() {
        let temp = this.state.addUrls
        let data = { name: '', url: '', count: 0 }
        temp.alternetUrl.push(data)
        this.setState({ addUrls: temp })
    }

    addUrl() {
        axios
            .post(`/urls/`, this.state.addUrls, {
              headers: {
            "Authorization": `${auth.default.getToken()}`,
            "userId": `${auth.default.getUserId()}`
          }
            })
            .then(res => {
                this.setState({ addUrls: { name: '', baseUrl: "", count: 0, alternetUrl: [] } })
                this.setState({
                    deleteAlert: false, editAlert: false, msg: {
                        message: '',
                        show: false
                    },
                    createAlert: true
                })
                document.getElementById('addUrl').click()
                this.getUrl()
            })
            .catch(err => {
              if(err.response.status === 401){
                window.location.reload();
              }
                if (err.response.status === 400) {
                    this.setState({
                        msg: {
                            message: err.response.data.error,
                            show: true
                        }
                    })
                }
                console.log(err.response)
            })
    }

    toBeAdd() {
        this.setState({
            addUrls: {
                name: "",
                baseUrl: "",
                count: 0,
                alternetUrl: []
            },
            toBeEdit: {},
            msg: {
                message: '',
                show: false
            }

        })
    }

    changeBaseUrl(event) {
        let temp = this.state.addUrls
        temp.baseUrl = event.target.value

        let data = this.state.tobeEditIndex
        data.baseGroupUrlChanged = true
        this.setState({ addUrls: temp, tobeEditIndex: data})
    }
    changeBaseName(event) {
        let temp = this.state.addUrls
        temp.name = event.target.value
        this.setState({ addUrls: temp })
    }

    changeCount(event) {
        let temp = this.state.addUrls
        temp.count = event.target.value
        this.setState({ addUrls: temp })
    }

    isUniqueURL(type) {
      let data = {
        temp: false,
        message: ''
      }
      this.state.allUrls.forEach(element => {
          if (type === 'addurl') {
              if (this.getGroupID(this.state.addUrls.baseUrl.replace(/\s/g, '')) !==  this.getGroupID(element.url)) {
                  this.state.addUrls.alternetUrl.forEach((alternet, i) => {
                      if (this.getGroupID(alternet.url.replace(/\s/g, '')) === this.getGroupID(element.url)) {
                          data.temp = true
                          data.message= alternet.name + ' Alternate Group invitation URL already exists in database'
                      }
                  })
              } else {
                  data.temp= true
                  data.message= this.state.addUrls.name + ' Base Group invitation URL already exists in database'
              }
          } else {
              if(this.state.tobeEditIndex.baseGroupUrlChanged) {
                if ((this.getGroupID(this.state.addUrls.baseUrl.replace(/\s/g, '')) !== this.getGroupID(this.state.toBeEdit.baseUrl.replace(/\s/g, '')))) {
                  if((this.getGroupID(this.state.addUrls.baseUrl.replace(/\s/g, '')) ===  this.getGroupID(element.url))) {
                    data.temp= true
                    data.message= this.state.addUrls.name + ' Base Group invitation URL already exists in database'
                  }
                }
              } else {
                if (this.state.tobeEditIndex.alternetUrlChange.length > 0) {
                  this.state.tobeEditIndex.alternetUrlChange.forEach(index => {
                  if(this.getGroupID(this.state.addUrls.alternetUrl[index].url.replace(/\s/g, '')) !== this.getGroupID(this.state.toBeEdit.alternetUrl[index].url.replace(/\s/g, ''))) {
                    if((this.getGroupID(this.state.addUrls.alternetUrl[index].url.replace(/\s/g, '')) ===  this.getGroupID(element.url))) {
                      data.temp = true
                      data.message= this.state.addUrls.alternetUrl[index].name + ' Alternate Group invitation URL already exists in database'
                    }
                  }
                });
                }
              }
          }
      })
      return data
    }

    getGroupID(url) {
     let split = url.split('/')
     let groupId = split[split.length - 1]
     if(groupId === '') {
         groupId = split[split.length -2]
     }
     return groupId
 }

    validateCount (count) {
      let data = {
        show: false,
        message: ''
      }
      let number =  parseInt(count, 10)
      if(!(number >=0 && number <=250)) {
        data.show = true
        data.message = 'count should be between 0-250'
      }
      return data
    }


 validateUrl (url) {
   let data = {
     show: false,
     message: ''
   }
   if(url === '') {
     data.show = true
     data.message = 'URL is required and can not be empty'
   } else {
     if(url.includes('invite')) {
       let valid = url.match(/https?\:\/\/(www\.)?chat(\.)?whatsapp(\.com)?\/invite?\/([a-zA-Z0-9_\-]{22}$)+(\/)?$/)
       if(!valid) {
         data.show = true
         data.message = 'invalid URL'
       }
     } else {
       let valid = url.match(/https?\:\/\/(www\.)?chat(\.)?whatsapp(\.com)?\/([a-zA-Z0-9_\-]{22}$)+(\/)?$/)
       if(!valid) {
         data.show = true
         data.message = 'invalid URL'
       }
     }
   }
   return data
 }

    validateName(name) {
      let data = {
        show: false,
        message: ''
      }
      if(name === '') {
        data.show = true
        data.message = 'name is required and can not be empty'
      }
      return data
    }

    validateAlternateGroups(groups) {

      let data = {
        message: '',
        show: false
      }
        groups.forEach((url, i) => {
          let validURL = this.validateUrl(url.url)
          let validName = this.validateName(url.name)
          let validCount = this.validateCount(url.count)
          if(validURL.show) data = {message: `${validURL.message} of Alternet Group ${url.name}`, show: validURL.show}
          else if(validName.show) data = {message: `Alternet Group ${validName.message}`, show: validName.show}
          else if(validCount.show) data = {message: `Alternet Group ${url.name} ${validCount.message}`, show: validCount.show}
          else if (url.url === this.state.addUrls.baseUrl ||
            (this.state.addUrls.alternetUrl[this.state.alternetUrlChangeIndex].url === url.url && this.state.alternetUrlChangeIndex !== i)) {
              data = {message: 'URL is not unique', show: true}
            }
        })
        return data
    }


    disable(type) {
        let temp = false
        let message = ''
        let data = this.isUniqueURL(type)
        console.log(data)
        temp = data.temp
        message = data.message
        if (temp) {
            this.setState({
                msg: {
                    message: message,
                    show: temp
                }
            })
        } else {
            let validBaseCount = this.validateCount(this.state.addUrls.count)
            let validBaseURL = this.validateUrl(this.state.addUrls.baseUrl)
            let validBaseName = this.validateName(this.state.addUrls.name)
            if (!validBaseURL.show
                && !validBaseName.show
                && !validBaseCount.show
            ) {
                if (this.state.addUrls.alternetUrl.length > 0) {
                    let data = this.validateAlternateGroups(this.state.addUrls.alternetUrl)
                    if (data.show) {
                        this.setState({
                            msg: data
                        })
                    } else {
                        if (type === 'addurl') this.addUrl()
                        else this.editURL()
                        this.setState({
                            msg: {
                                message: '',
                                show: false
                            }
                        })
                    }
                } else {
                    if (type === 'addurl') this.addUrl()
                    else this.editURL()
                    this.setState({
                        msg: {
                            message: '',
                            show: false
                        }
                    })
                }
            } else {
              let data = {
                message: '',
                show: false
              }
              console.log(validBaseURL)
              if(validBaseURL.show) data = {message: `Base Group ${validBaseURL.message}`, show: true}
              else if(validBaseName.show) data = {message: `Base Group ${validBaseName.message}`, show: true}
              else if(validBaseCount.show) data = {message: `Base Group ${validBaseCount.message}`, show: true}
                this.setState({
                    msg: data
                })
            }
        }
    }

    componentDidMount() {
        if (auth.default.getUserId()) {
          const userId = auth.default.getUserId()
          this.getUser(userId)
          this.setState({ deleteAlert: false })
          this.getUrl()
        }
    }

    logOut() {
        auth.default.logout()
        localStorage.removeItem('userToken')
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


    getUrl() {
        axios
            .get(`/urls/`, {
              headers: {
            "Authorization": `${auth.default.getToken()}`,
            "userId": `${auth.default.getUserId()}`
          }
            })
            .then(res => {
                let urls = res.data.payload
                this.setState({ allUrls: urls })
                let baseUrls = urls.filter(url => url.baseurl === 1)
                baseUrls.forEach((element, i) => {
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
                        bitly.shorten('https://swlb.cloudkibo.com' + element.redirectUrl)
                            .then(result => {
                                element.redirectUrl = result.link
                                this.setState({ baseUrls: baseUrls, dataForSearch: baseUrls, copied: false })
                            })
                            .catch(function (error) {
                                console.error(error);
                            });
                        this.setState({ showRedirectUrl: true })
                    } else {
                        this.setState({ showRedirectUrl: false })
                        element.redirectUrl = 'Groups are full'
                    }
                    let count = alternetUrls.length
                    element.alternetGroups = count
                });
                this.setState({ baseUrls: baseUrls,dataForSearch: baseUrls, copied: false })
            })
            .catch(err => {
              if(err.response.status === 401){
                window.location.reload();
              }
                console.log('i am the one',err.response)
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
                    <div style={{ width: '90%' }} className='col-sm-12' style={{ marginRight: '5%', marginBottom: '4px' }}>
                        {this.state.deleteAlert &&
                            <div className="alert alert-success" role="alert">
                                Deleted URL Successfully!
                        </div>
                        }
                    </div>
                    <div style={{ width: '90%' }} className='col-sm-12' style={{ marginRight: '5%', marginBottom: '4px' }}>
                        {this.state.copied &&
                            <div className="alert alert-primary" role="alert">
                                Redirect Link Copied!
                        </div>
                        }
                    </div>
                    <div style={{ width: '90%' }} className='col-sm-12' style={{ marginRight: '5%', marginBottom: '4px' }}>
                        {this.state.editAlert &&
                            <div className="alert alert-success" role="alert">
                                URL Edited Successfully!
                        </div>
                        }
                    </div>
                    <div style={{ width: '90%' }} className='col-sm-12' style={{ marginRight: '5%', marginBottom: '4px' }}>
                        {this.state.createAlert &&
                            <div className="alert alert-success" role="alert">
                                URL Created Successfully!
                        </div>
                        }
                    </div>
                    <div className='col-sm-12'>
                        <div className='row' style={{ width: '100%', margin: '0px 0px 0px 4%' }}>
                            <div className='col-sm-10'>
                                <input className="form-control" onChange={this.search} type="text" placeholder="Search" aria-label="Search" />
                            </div>
                            <div className='col-sm-2'>
                                <button type="button"
                                    data-toggle="modal"
                                    data-target="#addUrl"
                                    className="btn btn-primary"
                                    onClick={this.toBeAdd}>
                                    Add URL
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <table className="table" style={{ width: '90%', margin: '30px 0px 0px 5%' }}>
                            <thead>
                                <tr className="table-active">
                                    <th scope="col">Group Name</th>
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
                                                    <td>{url.name}</td>
                                                    <td>{url.url}</td>
                                                    <td>{url.alternetGroups}</td>
                                                    <td>{url.redirectUrl}</td>
                                                    <td>
                                                        {this.state.showRedirectUrl
                                                            &&
                                                            <a href='#/'
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
                            <div className="modal-body" style={{ maxHeight: '444px', overflow: 'auto' }}>
                                <div className='row'>
                                    {this.state.msg.show &&
                                        <div className='col-sm-12' style={{ marginRight: '5%', marginBottom: '4px' }}>
                                            <div className="alert alert-danger" role="alert">
                                                {this.state.msg.message}
                                            </div>
                                        </div>
                                    }
                                    <div className='col-sm-12'>
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
                                    <div className='col-sm-8'>
                                        <div className="form-group">
                                            <label>Base Group Name</label>
                                            <input
                                                type="text"
                                                name="baseUrl"
                                                className="form-control"
                                                value={this.state.addUrls.name}
                                                onChange={this.changeBaseName}
                                                placeholder="Enter Base Group Name" />
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
                                                        <div className='col-sm-12'>
                                                            <div className="form-group">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={item.url}
                                                                    onChange={(e) => this.alternetUrlChange(i, e)}
                                                                    placeholder="Enter Alterner Group URL" />
                                                            </div>
                                                        </div>
                                                        <div className='col-sm-6'>
                                                            <div className="form-group">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={item.name}
                                                                    onChange={(e) => this.alternetNameChange(i, e)}
                                                                    placeholder="Enter Group Name" />
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
                                                    <hr />
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
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Ignore</button>
                                <button type="button" className="btn btn-primary" onClick={() => this.disable('addurl')}>Add URL</button>
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
                            {this.state.wrongEmail &&
                                <div className='col-sm-12' style={{ marginRight: '5%', marginBottom: '4px' }}>
                                    <div className="alert alert-danger" role="alert">
                                        Email did not matched.
                                    </div>
                                </div>
                            }
                            <div className="modal-body">
                                Are you sure you want to delete this group?
                            </div>

                            <input style={{ margin: 'auto', width: '90%' }}
                                type="text"
                                className="form-control"
                                value={this.state.confirmEmail}
                                onChange={this.confirmEmail}
                                placeholder="Confirm By typing your email" />
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.deleteUrl}>Delete</button>
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
                            <div className="modal-body" style={{ maxHeight: '444px', overflow: 'auto' }}>
                                <div className='row'>
                                    {this.state.msg.show &&
                                        <div className='col-sm-12' style={{ marginRight: '5%', marginBottom: '4px' }}>
                                            <div className="alert alert-danger" role="alert">
                                                {this.state.msg.message}
                                            </div>
                                        </div>
                                    }
                                    <div className='col-sm-12'>
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
                                    <div className='col-sm-8'>
                                        <div className="form-group">
                                            <label>Base Group Name</label>
                                            <input
                                                type="text"
                                                name="baseUrl"
                                                className="form-control"
                                                value={this.state.addUrls.name}
                                                onChange={this.changeBaseName}
                                                placeholder="Enter Base Group Name" />
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
                                                        <div className='col-sm-12'>
                                                            <div className="form-group">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={item.url}
                                                                    onChange={(e) => this.alternetUrlChange(i, e)}
                                                                    placeholder="Enter Alterner Group URL" />
                                                            </div>
                                                        </div>
                                                        <div className='col-sm-6'>
                                                            <div className="form-group">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={item.name}
                                                                    onChange={(e) => this.alternetNameChange(i, e)}
                                                                    placeholder="Enter Alterner Group Name" />
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
                                                                data-toggle="modal"
                                                                data-target={this.state.addUrls.alternetUrl[i].url !== '' ? "#alternetDelete" : ""}
                                                                onClick={() => this.toBeAlternetDelete(i)}>
                                                                <span className="material-icons">
                                                                    delete_forever
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <hr />
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
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Ignore</button>
                                <button type="button" className="btn btn-primary" onClick={() => this.disable('editurl')}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* delete alternet modal */}
                <div className="modal fade bd-example-modal-sm" id="alternetDelete" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-sm" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Delete Confirmation</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            {this.state.wrongEmail &&
                                <div className='col-sm-12' style={{ marginRight: '5%', marginBottom: '4px' }}>
                                    <div className="alert alert-danger" role="alert">
                                        Email did not matched.
                                    </div>
                                </div>
                            }
                            <div className="modal-body">
                                Are you sure you want to delete this group?
                            </div>

                            <input style={{ margin: 'auto', width: '90%' }}
                                type="text"
                                className="form-control"
                                value={this.state.confirmEmail}
                                onChange={this.confirmEmail}
                                placeholder="Confirm By typing your email" />

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={() => this.deleteAtlernetUrl(-1)}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        );
    }

}
