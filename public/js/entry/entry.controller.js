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
import { getDiary, getDefaultFields, getDayEntry, setDayEntry, getAnnuals, getPeriods, setPeriod, setAnnuals } from '../db.js';
import { getDisplayableDate, getMmDd } from '../utils/date-utils.js';
import { redirectTo } from '../init.js';
function onDayChanged(day, diary) {
    redirectTo('/entry/', new URLSearchParams(`?day=${day}`));
}
function onEntryChanged(app, user, diary, entry) {
    return __awaiter(this, void 0, void 0, function* () {
        return setDayEntry(app, user, diary.uri, entry.date, entry);
    });
}
function onAnnualsChanged(app, user, date, diary, annuals, updated, id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (updated !== null) {
            if (id !== undefined) {
                annuals[id] = updated;
            }
            else {
                annuals.push(updated);
            }
        }
        else if (id !== undefined) {
            annuals.splice(id, 1);
        }
        const result = yield setAnnuals(app, user, diary.uri, getMmDd(date), annuals).catch((err) => err);
        return ("boolean" === typeof result) ? annuals : result;
    });
}
function onPeriodChanged(app, user, date, diary, period, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield setPeriod(app, user, diary.uri, id, period).catch((err) => err);
        return ("boolean" === typeof result) ? yield getPeriods(app, user, diary, date) : result;
    });
}
function switchPage(user, dateString) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date(dateString);
        document.title = `${getDisplayableDate(date)} | Lifetime Journal`;
        const diary = yield getDiary(app, user);
        const entry = yield getDayEntry(app, user, diary, dateString);
        const isEditMode = entry.fields === getDefaultFields(diary);
        const { annuals, leapYear } = yield getAnnuals(app, user, diary, date);
        const periods = yield getPeriods(app, user, diary, date);
        appendChild(document.body, {
            date: dateString,
            entry,
            annuals,
            leapYearAnnuals: leapYear,
            periods,
            onDayChanged: (day) => onDayChanged(day, diary.uri),
            onEntryChanged: (entry) => onEntryChanged(app, user, diary, entry),
            onAnnualChanged: (annual, id) => onAnnualsChanged(app, user, date, diary, annuals, annual, id),
            onPeriodChanged: (period, id) => onPeriodChanged(app, user, date, diary, period, id),
            isEditMode
        });
    });
}
export { switchPage };
