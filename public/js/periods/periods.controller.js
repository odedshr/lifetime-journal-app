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
import { getDiary, getPeriods, setPeriod } from '../db.js';
import { getDisplayableDate } from '../utils/date-utils.js';
import { redirectTo } from '../init.js';
function onDayChanged(day, diary) {
    redirectTo('/periods/', new URLSearchParams(`?day=${day}`));
}
function redirectToEntry(day, diary) {
    redirectTo('/entry/', new URLSearchParams(`?day=${day}`));
}
function onEditRequest(day, diary, id) {
    redirectTo('/periods/', new URLSearchParams(`?id=${id}&day=${day}`));
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
function switchPage(user, day, periodId) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date(day);
        document.title = `${getDisplayableDate(date)} | Periods | Lifetime Journal`;
        const diary = yield getDiary(app, user);
        const periods = yield getPeriods(app, user, diary, date);
        const removeItem = (id) => onChanged(app, user, diary, day, id, null);
        appendChild(
        /*0*/ document.body, 
        /*1*/ day, 
        /*2*/ periods, 
        /*3*/ (day) => onDayChanged(day, diary.uri), 
        /*4*/ (period) => onChanged(app, user, diary, day, period.id, period), 
        /*5*/ (id) => onEditRequest(day, diary.uri, id), 
        /*6*/ removeItem, 
        /*7*/ () => redirectToEntry(day, diary.uri), 
        /*8*/ periodId);
    });
}
export { switchPage };
