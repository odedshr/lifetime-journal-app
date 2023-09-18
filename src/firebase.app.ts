import { FirebaseApp, initializeApp } from "@firebase/app";
import { onAuthStateChanged, getAuth, User, signOut as signOutFromFirebase } from "@firebase/auth";
import { getAnalytics } from "@firebase/analytics";

import { getFirebaseConfig } from "./firebase.config.js";

const app: FirebaseApp = initializeApp(getFirebaseConfig());
const auth = getAuth(app);
const user: User | null = auth.currentUser;
const analytics = getAnalytics(app);

const SIGN_IN_ENDPOINT = '/signin';

// TBD: check when popstate is triggered
// window.addEventListener("popstate", (evt) => {
//   alert(
//     `popstate: location: ${document.location} ${evt}`
//   );
// });

async function getAuthenticateUser(): Promise<User> {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(
      auth,
      async (user: User | null) => user ? resolve(user) : reject('user not authenticated')
    );
  });
}

async function signOut() {
  await signOutFromFirebase(auth);
  switchToSignOutPage();
}

function switchToSignOutPage() {
  location.href = SIGN_IN_ENDPOINT;
}

export { app, auth, user, getAuthenticateUser, signOut, switchToSignOutPage };