import { FirebaseApp, initializeApp } from "@firebase/app";
import {
  connectAuthEmulator,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  getAuth,
  User,
  signOut as signOutFromFirebase
} from "@firebase/auth";
import { getAnalytics } from "@firebase/analytics";

import { getFirebaseConfig } from "./firebase.config.js";

const app: FirebaseApp = initializeApp(getFirebaseConfig());
const auth = getAuth(app);
const user: User | null = auth.currentUser;
const analytics = getAnalytics(app);

if (location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099');
}

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
}

async function signIn() {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  return await signInWithPopup(auth, provider).then(() => true).catch(() => false);
}

export { app, auth, user, getAuthenticateUser, signIn, signOut };