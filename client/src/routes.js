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
import AccountInformation from './components/accountInformation'

function requireAuth (nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function redirectAuthUsers(nextState, replace) {
  if (auth.loggedIn()) {
    replace({
      pathname: '/home',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const Routes = () => (
  <Switch>
    <Route exact path='/' component={Home} onEnter={redirectAuthUsers} />
    <Route path='/login' component={Login} onEnter={redirectAuthUsers} />
    <Route path='/signup' component={SignUp} onEnter={redirectAuthUsers} />
    <Route path='/home' component={Home} onEnter={requireAuth} />
    <Route path='/accountInformation' component={AccountInformation} onEnter={requireAuth} />
    <Route path='*' render={() => <Redirect to='/' />} />
  </Switch>
)

export default Routes
