import React, { Component } from "react";
import { login } from "../utility/auth.service";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            displayAlert: false,
            msg: '',
            alertType: ''
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount() {
        if (localStorage.userToken) {
            this.props.history.push('/home')
        }
        if(this.props.location.state && this.props.location.state.signedUp) {
            this.setState({displayAlert: true, msg: "SignUp Successfully", alertType: 'success'})
        }

    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    onSubmit(e) {
        e.preventDefault()
        const user = {
            email: this.state.email,
            password: this.state.password
        }
        login(user).then(res => {
            if (res.status === 202) {
                this.setState({displayAlert: true, msg: res.data.description, alertType: 'danger'})
            } else if (res.status === 200){
                localStorage.setItem('userToken', res.data.payload.token)
                this.props.history.push('/home')
            }
        })
    }
    render() {
        return (
            <div>
                <div className="auth-wrapper">
                    <div className="auth-inner">
                    {this.state.displayAlert && 
                        <div id='alert' className={this.state.alertType ? `alert alert-${this.state.alertType}`:'alert alert-info'}>{this.state.msg ? this.state.msg: 'Authentication Failed'}
                        </div>
                         }
                        <form onSubmit={this.onSubmit}>
                            <h3>Sign In</h3>
                            <div className="form-group">
                                <label>Email address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter email"
                                    value={this.state.email}
                                    onChange={this.onChange} />
                                <small id="emailHelp"
                                     className="form-text text-muted">
                                         We'll never share your email with anyone else.
                                </small>
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Enter password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                            <p className="forgot-password text-right">
                                Forgot <a href="/#">password?</a> Or, <a href="/sign-up">sign Up?</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
