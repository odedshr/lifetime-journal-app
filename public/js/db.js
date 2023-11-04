var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { connectFirestoreEmulator, getFirestore, collection, deleteDoc, doc, getDoc, getDocs, setDoc, query, where, Timestamp } from '@firebase/firestore';
import { getMmDd, getShorthandedMonthAndDay, isLeapYear } from './utils/date-utils.js';
let fireStore = null;
function getDB(app) {
    if (!fireStore) {
        fireStore = getFirestore(app);
        if (location.hostname === 'localhost') {
            connectFirestoreEmulator(fireStore, 'localhost', 8080);
        }
    }
    return fireStore;
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
function getAnnualsInternal(app, user, diary, mmDd) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = yield getDoc(doc(collection(getDB(app), getUserId(user)), diary.uri, "annuals", fixMmDdFormat(mmDd)));
        return (document.exists() ? sortAnnuals(document.data().events) : []);
    });
}
const LEAP_YEAR_ANNUAL = getShorthandedMonthAndDay(new Date(2024, 1, 29));
function getAnnuals(app, user, diary, date) {
    return __awaiter(this, void 0, void 0, function* () {
        const mmDd = getMmDd(date);
        return {
            annuals: yield getAnnualsInternal(app, user, diary, mmDd),
            leapYear: (mmDd !== '02-28' || isLeapYear(new Date(date))) ? [] : (yield getAnnualsInternal(app, user, diary, '02-29'))
                .map(annual => (Object.assign(Object.assign({}, annual), { label: `${annual.label} (${LEAP_YEAR_ANNUAL})` })))
        };
    });
}
function sortAnnuals(annuals) {
    return annuals.sort((a, b) => a.startYear - b.startYear);
}
function setAnnuals(app, user, diary, mmDd, annuals) {
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
function getPeriods(app, user, diary, date) {
    return __awaiter(this, void 0, void 0, function* () {
        const documents = yield getDocs(query(collection(getDB(app), getUserId(user), diary.uri, "periods"), where("startDate", "<=", Timestamp.fromDate(date))));
        const endDate = date.getTime();
        return documents.docs
            .map(doc => {
            var _a;
            const data = doc.data();
            return Object.assign(Object.assign({}, data), { id: doc.id, startDate: data.startDate.toDate(), endDate: (_a = data.endDate) === null || _a === void 0 ? void 0 : _a.toDate() });
        }).filter(period => !period.endDate || period.endDate.getTime() >= endDate);
    });
}
;
function getPeriod(app, user, diary, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = yield getDoc(doc(collection(getDB(app), getUserId(user)), diary.uri, "periods", id));
        return document.exists() ? document.data() : null;
    });
}
function setPeriod(app, user, diary, id, period) {
    return __awaiter(this, void 0, void 0, function* () {
        const docReference = id ?
            doc(collection(getDB(app), getUserId(user)), diary, "period", id) :
            doc(collection(getDB(app), getUserId(user)), diary, "period");
        try {
            if (id !== undefined && period === null) {
                deleteDoc(docReference);
            }
            else if (period !== null) {
                const record = Object.assign(Object.assign({}, period), { startDate: Timestamp.fromDate(period.startDate) });
                if (period.endDate) {
                    record.endDate = Timestamp.fromDate(period.endDate);
                }
                yield setDoc(docReference, record);
            }
            else {
                throw Error('period is null');
            }
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
export { getUserSettings, saveUserSettings, getDefaultFields, getDayEntry, setDayEntry, getAnnuals, setAnnuals, getPeriods, getPeriod, setPeriod };
