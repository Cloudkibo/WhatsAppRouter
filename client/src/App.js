import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Header from './components/header/header'
import Sidebar from './components/sidebar/sidebar'

class App extends Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <div>
        <Header history={this.props.history} location={this.props.location} />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar history={this.props.history} location={this.props.location} />
          { this.props.children }
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
}

export default App
