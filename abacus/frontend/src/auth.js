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

import { ref, fireAuth } from './fire';
import { UserInfo } from '.'

export function auth (email, pw) {
  return fireAuth().createUserWithEmailAndPassword(email, pw)
    .then(saveUser)
}

export function logout () {
  return fireAuth().signOut()
}

export function login (email, pw) {
  return fireAuth().signInWithEmailAndPassword(email, pw)
}

export function loginWithGoogle() {
    var provider = new fireAuth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    fireAuth().signInWithPopup(provider).then(function(result) {
        if (result.credential) {
            var token = result.credential.accessToken;
        }
        var user = result.user;
        //app.js should know when the auth state is changed
        //so no need to do anything with these variables yet
        //but this is how you get them
    }).catch(function(error) {
        return "Error " + error.code + ": " + error.message;
    });
}

export function resetPassword (email) {
  return fireAuth().sendPasswordResetEmail(email)
}

export function saveUser (user) {
  return ref.child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user)
}