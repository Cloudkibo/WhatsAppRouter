import React from 'react'
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import auth from './utility/auth.service.js'

import Login from "./components/login"
import SignUp from "./components/register"
import Home from './components/home'
// import AccountInformation from './components/accountInformation'
import Settings from './components/settings/settings'

function requireAuth (nextState, replace) {
  console.log('requireAuth called')
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function redirectAuthUsers(nextState, replace) {
  console.log('redirectAuthUsers called')
  if (auth.loggedIn()) {
    replace({
      pathname: '/home',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const Routes = () => (
  <Switch>
    <Route exact path="/" render={() => (
      auth.loggedIn() ? (
        <Home />
      ) : (
        <Redirect to="/login"/>
      )
    )}/>
    <Route path="/login" render={() => (
      !auth.loggedIn() ? (
        <Login />
      ) : (
        <Redirect to="/home"/>
      )
    )}/>
    <Route path="/signup" render={() => (
      !auth.loggedIn() ? (
        <SignUp />
      ) : (
        <Redirect to="/home"/>
      )
    )}/>
    <Route path="/home" render={() => (
      auth.loggedIn() ? (
        <Home />
      ) : (
        <Redirect to="/login"/>
      )
    )}/>
    <Route path="/settings" render={() => (
      auth.loggedIn() ? (
        <Settings />
      ) : (
        <Redirect to="/login"/>
      )
    )}/>
    <Route path='*' render={() => <Redirect to='/' />} />
  </Switch>
)

export default Routes
