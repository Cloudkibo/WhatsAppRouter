// import React, { Component } from "react";
// import { register } from "../utility/auth.service";
//
//
// export default class SignUp extends Component {
//     constructor() {
//         super();
//         this.state = {
//                 firstname: '',
//                 lastname: '',
//                 email: '',
//                 phone: '',
//                 password: '',
//                 confirmPassword: '',
//                 displayAlert: false,
//                 msg: '',
//                 alertType: ''
//         }
//         this.onChange = this.onChange.bind(this)
//         this.onSubmit = this.onSubmit.bind(this)
//     }
//
//     componentDidMount() {
//         if(localStorage.userToken){
//             this.props.history.push('/home')
//         }
//
//     }
//
//     onChange(e) {
//         this.setState({[e.target.name]: e.target.value})
//     }
//     onSubmit(e) {
//         e.preventDefault()
//
//         const user = {
//             firstname: this.state.firstname,
//             lastname: this.state.lastname,
//             email: this.state.email,
//             phone: this.state.phone,
//             password: this.state.password,
//             confirmPassword: this.state.confirmPassword
//         }
//         register(user).then(res => {
//             if (res.status === 202) {
//                 this.setState({displayAlert: true, msg: res.data.description, alertType: 'danger'})
//             } else if (res.status === 200) {
//                 this.props.history.push('/sign-in',
//                 {signedUp: true}
//                 )
//             }
//         })
//     }
//     render() {
//         return (
//             <div className="auth-wrapper">
//                 <div className="auth-inner">
//                 {this.state.displayAlert &&
//                         <div id='alert' className={this.state.alertType ? `alert alert-${this.state.alertType}`:'alert alert-info'}>{this.state.msg ? this.state.msg: 'Authentication Failed'}
//                         </div>
//                          }
//                     <form onSubmit={this.onSubmit}>
//                         <h3>Sign Up</h3>
//                         <div className='row'>
//                             <div className='col-sm-6 form-group'>
//                             <label>First name</label>
//                             <input
//                                 type="text"
//                                 name='firstname'
//                                 className="form-control"
//                                 placeholder="First name"
//                                 value={this.state.firstname}
//                                 onChange={this.onChange}
//                                 required />
//                             </div>
//                             <div className='col-sm-6 form-group'>
//                             <label>Last name</label>
//                             <input
//                                 type="text"
//                                 name='lastname'
//                                 className="form-control"
//                                 placeholder="Last name"
//                                 value={this.state.lastname}
//                                 onChange={this.onChange}
//                                 required />
//                             </div>
//                         </div>
//
//                         <div className="form-group">
//                             <label>Phone Number</label>
//                             <input
//                                 type="phone"
//                                 name='phone'
//                                 className="form-control"
//                                 placeholder="Enter phone number"
//                                 value={this.state.phone}
//                                 onChange={this.onChange}
//                                 required />
//                         </div>
//
//                         <div className="form-group">
//                             <label>Email address</label>
//                             <input
//                                 type="email"
//                                 name='email'
//                                 className="form-control"
//                                 placeholder="Enter email"
//                                 value={this.state.email}
//                                 onChange={this.onChange}
//                                 required />
//                         </div>
//
//                         <div className="form-group">
//                             <label>Password</label>
//                             <input
//                                 type="password"
//                                 name='password'
//                                 className="form-control"
//                                 placeholder="Enter password"
//                                 value={this.state.password}
//                                 onChange={this.onChange}
//                                 required />
//                         </div>
//
//                         <div className="form-group">
//                             <label>Confirm password</label>
//                             <input
//                                 type="password"
//                                 name='confirmPassword'
//                                 className="form-control"
//                                 placeholder="Enter same password again"
//                                 value={this.state.confirmPassword}
//                                 onChange={this.onChange}
//                                 required />
//                         </div>
//
//                         <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
//                         <p className="forgot-password text-right">
//                             Already registered <a href="/sign-in">sign in?</a>
//                         </p>
//                     </form>
//                 </div>
//             </div>
//         );
//     }
// }
