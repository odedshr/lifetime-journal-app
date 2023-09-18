var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { app, getAuthenticateUser, switchToSignOutPage } from '../firebase.app.js';
import { deploy as deployEntry } from './entry.html.js';
import { getUserSettings, getDayEntry, setDayEntry } from '../db.js';
import { switchPage as switchToSetup } from '../setup/setup.page.js';
import { getFormattedDate, getDisplayableDate, getDateFromURL } from '../utils/date-utils.js';
const DEFAULT_DIARY = "diary-01";
window.addEventListener('load', () => getAuthenticateUser().then(initPage).catch(switchToSignOutPage));
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
        setPageTitle(day);
        deployEntry(document.body, day, entry, {
            onEntryChanged: (entry) => onEntryChanged(app, user, entry),
            onDateChanged: (date) => navigateToDay(user, date),
        });
    });
}
function onEntryChanged(app, user, entry) {
    return __awaiter(this, void 0, void 0, function* () {
        return setDayEntry(app, user, DEFAULT_DIARY, entry.date, entry);
    });
}
function switchPage(user) {
    navigateToDay(user, getFormattedDate(new Date()));
}
function navigateToDay(user, day) {
    history.pushState({}, '', `/entry/?day=${day}`);
    deploy(user);
}
function setPageTitle(dateString) {
    document.title = `${getDisplayableDate(new Date(dateString))} | Lifetime Journal`;
}
export { initPage, switchPage };
