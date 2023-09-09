import { signInWithPopup, onAuthStateChanged, GoogleAuthProvider, signOut, User, UserCredential } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { user, auth } from '../firebase.app.js';

function toggleSignIn() {
  if (!user) {
    var provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    signInWithPopup(auth, provider).then(function (result: UserCredential) {
      location.href = '/';
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.providerId;
      // The signed-in user info.
      var user = result.user;
      getElementById('quickstart-oauthtoken').textContent = user + " " + token;
    }).catch(function (error: any) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different auth provider for that email.');
        // If you are using multiple auth providers on your app you should handle linking
        // the user's accounts here.
      } else {
        console.error(error);
      }
    });
  } else {
    signOut(auth);
  }
  (getElementById('quickstart-sign-in') as HTMLButtonElement).disabled = true;
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      getElementById('quickstart-sign-in').textContent = 'Sign out';
      getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
    } else {
      //   // User is signed out.
      getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      getElementById('quickstart-sign-in').textContent = 'Sign in with Google';
      getElementById('quickstart-account-details').textContent = 'null';
      getElementById('quickstart-oauthtoken').textContent = 'null';
    }
    (getElementById('quickstart-sign-in') as HTMLButtonElement).disabled = false;

    return user;
  });

  getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
}

function getElementById(elementId: string): HTMLElement {
  return document.getElementById(elementId) || document.createElement('div');
}

window.onload = function () {
  initApp();
};