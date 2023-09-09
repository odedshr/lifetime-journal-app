var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getFirestore, collection, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';
function getDB(app) {
    return getFirestore(app);
}
function getUserId(user) {
    return user.email ? user.email.replace(/\./g, '-') : user.uid;
}
function getUserSettings(app, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = yield getDoc(doc(collection(getDB(app), getUserId(user)), "settings"));
        if (document.exists()) {
            return document.data();
        }
        return { diaries: [] };
    });
}
function saveUserSettings(app, user, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        yield setDoc(doc(collection(getDB(app), getUserId(user)), "settings"), settings);
    });
}
export { getUserSettings, saveUserSettings };
