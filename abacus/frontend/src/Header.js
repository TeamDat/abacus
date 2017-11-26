/*******************************************************************************
 * Copyright (c) Team.Dat / Team 7147 GATech.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 * Ian Ewell, Logan Gillespie, Ginna Groover, Brighton Trugman, Caroline Zhang
 *******************************************************************************/

import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar'
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import {logout} from './auth';
import logo from './abacus_logo.png'

export default class Header extends React.Component {
    render() {
        var navbar_style = {
            "backgroundImage" : "none",
            "backgroundColor": "black",
            "height": "4.5em",
        }

        const logo_style = {
            "width": "150px"
        }

        return (
            <Navbar style={navbar_style}>
                    <Navbar.Brand>
                        <a href='/'>
                            <img src={logo} alt={"Abacus"} style={logo_style}/>
                        </a>
                    </Navbar.Brand>
                    {this.props.authed
                        ?
                        <Nav pullRight>
                            <NavItem Link to href="/home" >Start</NavItem>
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
