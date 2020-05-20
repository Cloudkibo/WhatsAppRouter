import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Header from './components/header/header'
import Sidebar from './components/sidebar/sidebar'
import auth from './utility/auth.service.js'


class App extends Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <div>
      {auth.loggedIn() ?
        <span>
          <Header history={this.props.history} location={this.props.location} />
          <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
            <Sidebar history={this.props.history} location={this.props.location} />
            { this.props.children }
          </div>
          </span>
          : <span>
            { this.props.children }
            </span>
      }

      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
}

export default App
