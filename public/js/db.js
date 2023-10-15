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
import { getMmDd, getShorthandedMonthAndDay, isLeapYear } from './utils/date-utils.js';
function getDB(app) {
    return getFirestore(app);
}
function getUserId(user) {
    if (!user.email) {
        throw Error('User must have email');
    }
    return user.email.replace(/\./g, '-');
}
function getDefaultFields(diary) {
    return diary.defaultFields || [{ type: 'text', value: '' }];
}
function getDayEntry(app, user, diary, date) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = yield getDoc(doc(collection(getDB(app), getUserId(user)), diary.uri, "entries", date));
        if (document.exists()) {
            return document.data();
        }
        const fields = getDefaultFields(diary);
        return { date, fields };
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
function getAnnuals(app, user, diary, mmDd) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = yield getDoc(doc(collection(getDB(app), getUserId(user)), diary.uri, "annuals", fixMmDdFormat(mmDd)));
        return (document.exists() ? sortAnnuals(document.data().events) : []);
    });
}
const LEAP_YEAR_ANNUAL = getShorthandedMonthAndDay(new Date(2024, 1, 29));
function getDayAnnuals(app, user, diary, date) {
    return __awaiter(this, void 0, void 0, function* () {
        const mmDd = getMmDd(date);
        return {
            annuals: yield getAnnuals(app, user, diary, mmDd),
            leapYear: (mmDd !== '02-28' || isLeapYear(new Date(date))) ? [] : (yield getAnnuals(app, user, diary, '02-29'))
                .map(annual => (Object.assign(Object.assign({}, annual), { label: `${annual.label} (${LEAP_YEAR_ANNUAL})` })))
        };
    });
}
function sortAnnuals(annuals) {
    return annuals.sort((a, b) => a.startYear - b.startYear);
}
function setDayAnnuals(app, user, diary, mmDd, annuals) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield setDoc(doc(collection(getDB(app), getUserId(user)), diary, "annuals", fixMmDdFormat(mmDd)), { events: annuals });
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
function fixMmDdFormat(mmDd) {
    return mmDd.replace(/\//g, '-');
}
export { getUserSettings, saveUserSettings, getDefaultFields, getDayEntry, setDayEntry, getDayAnnuals, setDayAnnuals };
