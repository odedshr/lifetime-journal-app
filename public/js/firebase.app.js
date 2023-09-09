var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { onAuthStateChanged, getAuth, signOut as signOutFromFirebase } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-analytics.js";
import { getFirebaseConfig } from "./firebase.config.js";
const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);
const user = auth.currentUser;
const analytics = getAnalytics(app);
const SIGN_IN_ENDPOINT = '/signin';
function onPageLoadedAndUserAuthenticated(callback) {
    const state = { user: null, pageLoaded: false };
    window.addEventListener("popstate", (event) => {
        alert(`location: ${document.location}, state: ${JSON.stringify(event.state)}`);
    });
    onAuthStateChanged(auth, (user) => __awaiter(this, void 0, void 0, function* () {
        if (user) {
            state.user = user;
            if (state.pageLoaded) {
                callback(user);
            }
        }
        else {
            location.href = SIGN_IN_ENDPOINT;
        }
    }));
    window.addEventListener('load', () => {
        state.pageLoaded = true;
        if (state.user) {
            callback(state.user);
        }
    });
}
function signOut() {
    return __awaiter(this, void 0, void 0, function* () {
        yield signOutFromFirebase(auth);
        location.href = SIGN_IN_ENDPOINT;
    });
}
export { app, auth, user, onPageLoadedAndUserAuthenticated, signOut };
