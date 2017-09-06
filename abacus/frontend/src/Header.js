import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar'
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import {logout} from './auth';


export default class Header extends React.Component {
    render() {
        return (
            <Navbar inverse >
                    <Navbar.Brand>
                        <a href='/'>Abacus</a>
                    </Navbar.Brand>
                    {this.props.authed
                        ?
                        <Nav pullRight>
                            <NavItem Link to href="/home">Start</NavItem>
                            <NavItem onClick={() => {
                                logout();
                            }}> Logout </NavItem>
                        </Nav>
                        :
                        <Nav pullRight>
                            <NavItem Link to href="/about">About</NavItem>
                            <NavItem Link to href="/login">Login</NavItem>
                            <NavItem Link to href="/register">Register</NavItem>
                        </Nav>
                    }
            </Navbar>
        );
    }
}
