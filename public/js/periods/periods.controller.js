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
import { appendChild } from "./periods.html.js";
import { getUserSettings, getPeriods, setPeriod } from '../db.js';
import { getDisplayableDate } from '../utils/date-utils.js';
import { redirectTo } from '../init.js';
const DEFAULT_DIARY = { uri: "diary-01" };
function onDayChanged(day, diary) {
    redirectTo('/periods/', new URLSearchParams(`?day=${day}&diary=${diary}`));
}
function redirectToEntry(day, diary) {
    redirectTo('/entry/', new URLSearchParams(`?day=${day}&diary=${diary}`));
}
function onEditRequest(day, diary, id) {
    redirectTo('/periods/', new URLSearchParams(`?id=${id}&day=${day}&diary=${diary}`));
}
function onChanged(app, user, diary, day, id, period) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield setPeriod(app, user, diary.uri, id, period)) {
            redirectToEntry(day, diary.uri);
            return true;
        }
        return false;
    });
}
function switchPage(user, day, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date(day);
        document.title = `${getDisplayableDate(date)} | Periods | Lifetime Journal`;
        const settings = yield getUserSettings(app, user);
        const diary = settings.diaries[0] || DEFAULT_DIARY;
        const periods = yield getPeriods(app, user, diary, date);
        const removeItem = (id) => onChanged(app, user, diary, day, id, null);
        appendChild(document.body, day, periods, (day) => onDayChanged(day, diary.uri), (period) => onChanged(app, user, diary, day, period.id, period), (id) => onEditRequest(day, diary.uri, id), removeItem, () => redirectToEntry(day, diary.uri), id);
    });
}
export { switchPage };
