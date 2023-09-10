var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { app, onPageLoadedAndUserAuthenticated, signOut } from '../firebase.app.js';
import { deploy as deployEntry } from './entry.html.js';
import { getUserSettings, getDayEntry, setDayEntry } from '../db.js';
import { switchPage as switchToSetup } from '../setup/setup.page.js';
const DEFAULT_DIARY = "diary-01";
onPageLoadedAndUserAuthenticated(initPage);
function initPage(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = yield getUserSettings(app, user);
        if (settings.diaries.length > 0) {
            deploy(user);
        }
        else {
            switchToSetup(user, settings);
        }
    });
}
function deploy(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const day = getDateFromURL(window.location.search);
        const entry = yield getDayEntry(app, user, DEFAULT_DIARY, day);
        deployEntry(document.body, day, entry, {
            onEntryChanged: (entry) => onEntryChanged(app, user, entry),
            onDateChanged: (date) => navigateToDay(user, date),
            onSignOut: signOut,
        });
    });
}
function onEntryChanged(app, user, entry) {
    return __awaiter(this, void 0, void 0, function* () {
        setDayEntry(app, user, DEFAULT_DIARY, entry.date, entry);
    });
}
function getFormattedDate(date) {
    return date.toISOString().split('T')[0];
}
function getDateFromURL(urlSearchParamString) {
    return new URLSearchParams(urlSearchParamString).get("day") || getFormattedDate(new Date());
}
function switchPage(user) {
    navigateToDay(user, getFormattedDate(new Date()));
}
function navigateToDay(user, day) {
    console.log('navigateToDay', day);
    history.pushState({}, '', `/entry/?day=${day}`);
    deploy(user);
}
export { switchPage };
