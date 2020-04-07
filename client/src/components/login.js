import React, { Component } from "react";
import { login } from "../utility/auth.service";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }
    onSubmit(e) {
        e.preventDefault()

        const user = {
            email: this.state.email,
            password: this.state.password
        }
        login(user).then(res => {
            if(res) {
                this.props.history.push('/home')
            }
        })
    }
    render() {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
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
        );
    }
}