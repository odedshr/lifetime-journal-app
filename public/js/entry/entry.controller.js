var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { app } from '../firebase.app.js';
import { appendChild } from "./entry.html.js";
import { getUserSettings, getDayEntry, setDayEntry, getDayAnnuals } from '../db.js';
import { getDisplayableDate } from '../utils/date-utils.js';
import { redirectTo } from '../init.js';
const DEFAULT_DIARY = { uri: "diary-01" };
function onDayChanged(day, diary) {
    redirectTo('/entry/', new URLSearchParams(`?day=${day}&diary=${diary}`));
}
function onAnnualEditRequest(day, diary, id) {
    redirectTo('/annuals/', new URLSearchParams(`?${id !== undefined ? `id=${id}&` : ''}day=${day}&diary=${diary}`));
}
function onEntryChanged(app, user, diary, entry) {
    return __awaiter(this, void 0, void 0, function* () {
        return setDayEntry(app, user, diary.uri, entry.date, entry);
    });
}
function switchPage(user, day) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date(day);
        document.title = `${getDisplayableDate(date)} | Lifetime Journal`;
        const settings = yield getUserSettings(app, user);
        const diary = settings.diaries[0] || DEFAULT_DIARY;
        const entry = yield getDayEntry(app, user, diary, day);
        const { annuals, leapYear } = yield getDayAnnuals(app, user, diary, date);
        appendChild(document.body, day, entry, annuals, leapYear, (day) => onDayChanged(day, diary.uri), (entry) => onEntryChanged(app, user, diary, entry), (id) => onAnnualEditRequest(day, diary.uri, id));
    });
}
export { switchPage };
