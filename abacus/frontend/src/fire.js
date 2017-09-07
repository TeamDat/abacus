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

import firebase from 'firebase';
var config = {
    apiKey: "AIzaSyBYBcOLBvBeZYl4V8CcXo8a6d0Uh2JNh08",
    authDomain: "abacus-teamdat.firebaseapp.com",
    databaseURL: "https://abacus-teamdat.firebaseio.com",
    projectId: "abacus-teamdat",
    storageBucket: "abacus-teamdat.appspot.com",
    messagingSenderId: "282732854298"
  };
var fire = firebase.initializeApp(config);
export const ref = firebase.database().ref();
export const fireAuth = firebase.auth;
export default fire;