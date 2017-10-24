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
import {login, loginWithGoogle, resetPassword} from './auth';

/**
 * Display error message if unsuccessful login
 * @param {*} error Unsuccessful login error 
 */
function setErrorMsg(error) {
    return {
        loginMessage: error
    }
}

export default class Login extends Component {
    state = {loginMessage: null};
    /**
     * Submit username and password
     */
    handleSubmit = (e) => {
        e.preventDefault();
        login(this.email.value, this.pw.value)
            .catch((error) => {
                this.setState(setErrorMsg('Invalid username/password.'))
            })
    };
    /**
     * Reset password if user forgets password
     */
    resetPassword = () => {
        resetPassword(this.email.value)
            .then(() => this.setState(setErrorMsg(`Password reset email sent to ${this.email.value}.`)))
            .catch((error) => this.setState(setErrorMsg(`Email address not found.`)))
    };

    render() {
        return (
            <div className="col-sm-6 col-sm-offset-3">
                <h1> Login </h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input className="form-control" ref={(email) => this.email = email} placeholder="Email"/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Password"
                               ref={(pw) => this.pw = pw}/>
                    </div>
                    {
                        this.state.loginMessage &&
                        <div className="alert alert-danger" role="alert">
                            <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"/>
                            <span className="sr-only">Error:</span>
                            &nbsp;{this.state.loginMessage}
                            <button onClick={resetPassword} className="alert-link">Forgot Password?</button>
                        </div>
                    }
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
                <br/>
                <button onClick={this.state.loginMessage = loginWithGoogle()} className="btn btn-primary">Or sign in
                    with Google
                </button>
            </div>
        )
    }
}