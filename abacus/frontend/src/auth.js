import { ref, fireAuth } from './fire'

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