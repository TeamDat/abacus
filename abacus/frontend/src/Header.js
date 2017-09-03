import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar'
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import {logout} from './auth';
import {Link} from "react-router-dom";

export default class Header extends React.Component {
    render() {
        return (
            <Navbar inverse>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href='/'>Abacus</a>
                    </Navbar.Brand>
                </Navbar.Header>
                    {this.props.authed
                        ?
                        <Nav pullRight>
                            <NavItem>
                                <Link to="/about">About</Link>
                            </NavItem>
                            <NavItem onClick={() => {
                                logout();
                            }}> Logout </NavItem>
                        </Nav>
                        :
                        <Nav pullRight>
                            <NavItem>
                                <Link to="/about">About</Link>
                            </NavItem>
                            <NavItem>
                                <Link to="/login">Login</Link>
                            </NavItem>
                            <NavItem>
                                <Link to="/register">Register</Link>
                            </NavItem>
                        </Nav>
                    }
            </Navbar>
        );
    }
}
