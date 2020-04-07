import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./components/login";
import SignUp from "./components/register";

import Home from './components/home';

class App extends Component {
  constructor() {
    super();
    this.state = {
    }
  }
  
  render() {
    return (
      <Router>
          <Switch>
            <Route exact path="/home" component={Home}/>
            <Route exact path='/' component={Login} />
            <Route exact path="/sign-in" component={Login} />
            <Route exact path="/sign-up" component={SignUp} />
          </Switch>
      </Router>
    );
  }
}

export default App;
