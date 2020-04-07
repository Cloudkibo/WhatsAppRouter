import React, { Component } from 'react';

export class Header extends Component {
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container">
                    <div className="navbar-header">
                        <ul className="nav navbar-nav">
                            <li><a href='/#'>home</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header;