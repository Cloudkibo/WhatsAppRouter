import React, { Component } from 'react';
import jwt_decode from 'jwt-decode'
import Navbar from './navbar';


export class Home extends Component {
    constructor() {
        super();
        this.state ={
            firstname: '',
            lastname: '',
            email: ''
        }
    }

    componentDidMount() {
        if(!localStorage.userToken){
            this.props.history.push('/sign-in')
        } else {
            const token = localStorage.userToken
            const decode = jwt_decode(token)
            console.log(decode)
        }
        
    }

    render() {
        return (
            <div>
                <Navbar />
                <p>Home Component</p>
            </div>
        );
    }
}

export default Home;