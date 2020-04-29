import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

import Login from "./components/login";
// import SignUp from "./components/register";

import Home from './components/home';
import AccountInformation from './components/accountInformation';
import auth from './utility/auth.service.js'
class App extends Component {
  constructor() {
    super();
    this.state = {
    }
    this.requireAuth = this.requireAuth.bind(this)
    this.ifLoggedIn = this.ifLoggedIn.bind(this)
  }

requireAuth (nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

ifLoggedIn(nextState, replace) {
  if (auth.loggedIn()) {
    replace({
      pathname: '/home',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

  render() {
    return (
      <Router>
          <Switch>
            <Route exact path="/login" render={() => (
              auth.loggedIn() ? (
                <Redirect to="/home"/>
              ) : (
                <Login />
              )
            )} />
            <Route exact path="/home"
            render={() => (
              !auth.loggedIn() ? (
                <Redirect to="/login"/>
              ) : (
                <Home />
              )
            )}/>
            <Route exact path="/accountInformation" render={() => (
              !auth.loggedIn() ? (
                <Redirect to="/login"/>
              ) : (
                <AccountInformation />
              )
            )} />
            <Route path='/' render={() => (
              auth.loggedIn() ? (
                <Redirect to="/home"/>
              ) : (
                <Login />
              )
            )}/>

          </Switch>
      </Router>
    );
  }
}

export default App;
