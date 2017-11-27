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

import React, {Component} from 'react';
import {Route, BrowserRouter, Redirect, Switch} from 'react-router-dom';
import {fireAuth} from './fire';
import './App.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Header from "./Header";
import Footer from "./Footer";
import About from './About';
import Messages from './Messages';

/**
 * Creates a route to render a page that is only visible if you logged in.
 *
 * @param component  The component to render
 * @param authed  Whether the user has authenticated
 */
function PrivateRoute({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props} />
                : <Redirect to={{pathname: '/login', state: {from: props.location}}}/>}/>
    )
}

/**
 * Creates a route to render a page that is publicly visible.
 *
 * @param component  The component to render
 * @param authed  Whether the user has authenticated
 */
function PublicRoute({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === false
                ? <Component {...props} />
                : <Redirect to='/home'/>}/>
    )
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authed: false,
            loading: true,
            currentUser: null
        };
    }

    /**
     * Adds a listener that detects a login and updates the authed state
     */
    componentDidMount() {
        this.removeListener = fireAuth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authed: true,
                    loading: false,
                    currentUser: user.uid
                });
            } else {
                this.setState({
                    authed: false,
                    loading: false
                })
            }
        });
    }

    /**
     * Checks to see if a login has occured
     */
    componentWillUnmount() {
        this.removeListener();
    }

    render() {
        return this.state.loading === true ? <h1>Loading</h1> : (
            <BrowserRouter>
                <div>
                    <div id="header-container">
                        <Header authed={this.state.authed}/>
                    </div>
                    <div className="container">
                        <div className="row">
                            <Switch>
                                <Route path='/' exact component={About}/>
                                <Route path='/about' exact component={About}/>
                                <PublicRoute authed={this.state.authed} path='/login' component={Login}/>
                                <PublicRoute authed={this.state.authed} path='/register' component={Register}/>
                                <PrivateRoute authed={this.state.authed} currentUser={this.state.currentUser} path='/home' component={Home}/>
                                <PrivateRoute authed={this.state.authed} currentUser={this.state.currentUser} path='/messages' component={Messages}/>

                                <Route render={() => <h3>Page Not Found</h3>}/>
                            </Switch>
                        </div>
                    </div>
                    <div style={{paddingTop: 75}}>
                        <Footer  authed={this.state.authed}/>
                    </div>

                </div>
            </BrowserRouter>
        );
    }
}

export default App;
