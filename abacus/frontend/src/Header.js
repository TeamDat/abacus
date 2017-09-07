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

export default class Header extends React.Component {
    render() {
        return (
            <Navbar inverse>
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
