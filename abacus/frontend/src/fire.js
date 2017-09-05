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