var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initializeApp } from "@firebase/app";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, getAuth, signOut as signOutFromFirebase } from "@firebase/auth";
import { getAnalytics } from "@firebase/analytics";
import { getFirebaseConfig } from "./firebase.config.js";
const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);
const user = auth.currentUser;
const analytics = getAnalytics(app);
const SIGN_IN_ENDPOINT = '/signin';
// TBD: check when popstate is triggered
// window.addEventListener("popstate", (evt) => {
//   alert(
//     `popstate: location: ${document.location} ${evt}`
//   );
// });
function getAuthenticateUser() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, (user) => __awaiter(this, void 0, void 0, function* () { return user ? resolve(user) : reject('user not authenticated'); }));
        });
    });
}
function signOut() {
    return __awaiter(this, void 0, void 0, function* () {
        yield signOutFromFirebase(auth);
    });
}
function signIn() {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        return yield signInWithPopup(auth, provider).then(() => true).catch(() => false);
    });
}
export { app, auth, user, getAuthenticateUser, signIn, signOut };
