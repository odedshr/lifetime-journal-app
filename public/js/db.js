var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getFirestore, collection, doc, getDoc, setDoc } from '@firebase/firestore';
function getDB(app) {
    return getFirestore(app);
}
function getUserId(user) {
    if (!user.email) {
        throw Error('User must have email');
    }
    return user.email.replace(/\./g, '-');
}
function getDayEntry(app, user, diary, date) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = yield getDoc(doc(collection(getDB(app), getUserId(user)), diary, "entries", date));
        if (document.exists()) {
            return document.data();
        }
        const defaultField = { type: 'text', value: '' };
        return { date, fields: [defaultField] };
    });
}
function setDayEntry(app, user, diary, day, entry) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield setDoc(doc(collection(getDB(app), getUserId(user)), diary, "entries", day), entry);
            return true;
        }
        catch (err) {
            return false;
        }
    });
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
export { getUserSettings, saveUserSettings, getDayEntry, setDayEntry };
