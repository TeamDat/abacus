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
import fire from './fire';
import {fireAuth} from './fire';
import './App.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Header from "./Header";
import About from './About';

function PrivateRoute({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props} />
                : <Redirect to={{pathname: '/login', state: {from: props.location}}}/>}/>
    )
}

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
            messages: [],
            authed: false,
            loading: true,
            currentUser: null
        };
    }

    componentWillMount() {
        let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
        messagesRef.on('child_added', snapshot => {
            let message = {text: snapshot.val()['value'], id: snapshot.key, user: snapshot.val()['uid']};
            this.setState({messages: [message].concat(this.state.messages)});
        });
    }

    addMessage(e) {
        e.preventDefault();
        fire.database().ref('messages').push({
            value: this.inputEl.value,
            uid: this.state.currentUser
        });
        this.inputEl.value = '';
    }

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
                                <Route authed={this.state.authed} path='/about' component={About}/>
                                <Route render={() => <h3>No Match</h3>}/>
                            </Switch>
                        </div>
                    </div>
                    <div id="feedback-container" style={{paddingTop: 100, display: 'flex', justifyContent: 'center'}}>
                        {this.state.authed ?
                            <div>
                                <h4>Submit feedback:</h4>
                                <form onSubmit={this.addMessage.bind(this)}>
                                    <input type="text" ref={el => this.inputEl = el}/>
                                    <input type="submit"/>
                                </form>
                                <h4>Your previous feedback:</h4>
                                <ul>
                                    {
                                        this.state.messages.filter(message => {
                                            return message.user === this.state.currentUser
                                        }).map(message => <li key={message.id}>{message.text}</li>)
                                    }
                                </ul>
                            </div>
                            :
                            <h4> Please log in to submit feedback. </h4>}
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
