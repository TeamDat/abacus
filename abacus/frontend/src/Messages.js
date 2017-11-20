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
import fire from './fire';
import {fireAuth} from './fire';



export default class Messages extends React.Component {
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
        let messagesRef = fire.database().ref('feedback').orderByKey().limitToLast(100);
        messagesRef.on('child_added', snapshot => {
            let message = {text: snapshot.val()['value'], id: snapshot.key, user: snapshot.val()['uid']};
            this.setState({messages: [message].concat(this.state.messages)});
        });
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

    /**
     * Sends feedback the user has written
     *
     * @param e  The event object
     */
    addMessage(e) {
        e.preventDefault();
        fire.database().ref('feedback').push({
            value: this.inputEl.value,
            uid: this.state.currentUser
        });
        this.inputEl.value = '';
    }

    render() {
        return (
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
        );
    }
}
