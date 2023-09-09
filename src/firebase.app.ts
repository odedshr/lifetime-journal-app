import { FirebaseApp, initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { onAuthStateChanged, getAuth, User, signOut as signOutFromFirebase } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-analytics.js";

import { getFirebaseConfig } from "./firebase.config.js";

const app: FirebaseApp = initializeApp(getFirebaseConfig());
const auth = getAuth(app);
const user: User | null = auth.currentUser;
const analytics = getAnalytics(app);

const SIGN_IN_ENDPOINT = '/signin';


function onPageLoadedAndUserAuthenticated(callback: ((user: User) => void)) {
  type State = { user: User | null, pageLoaded: boolean };
  const state: State = { user: null, pageLoaded: false };

  window.addEventListener("popstate", (event) => {
    alert(
      `location: ${document.location}, state: ${JSON.stringify(event.state)}`,
    );
  });

  onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      state.user = user;
      if (state.pageLoaded) {
        callback(user);
      }
    } else {
      location.href = SIGN_IN_ENDPOINT;
    }
  });

  window.addEventListener('load', () => {
    state.pageLoaded = true;
    if (state.user) {
      callback(state.user);
    }
  });
}

async function signOut() {
  await signOutFromFirebase(auth);
  location.href = SIGN_IN_ENDPOINT;
}

export { app, auth, user, onPageLoadedAndUserAuthenticated, signOut };