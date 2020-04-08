import React, { Component } from 'react';

export default class Alert extends Component {
    constructor() {
        super();
        this.state = {
            msg: ''
        }
        this.hideAlert = this.hideAlert.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps && nextProps.msg) {
            this.setState({msg: nextProps.msg})
        }
    }

    hideAlert () {
        this.setState({msg: ''})
    }

    render() {
        return (
            <span>
                {this.state.msg !== ''
                && <div className="alert alert-warning alert-dismissible" role="alert">
                {this.props.msg}
                <button type="button" onClick={this.hideAlert} className="close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
                }
            </span>


        );
    }
}