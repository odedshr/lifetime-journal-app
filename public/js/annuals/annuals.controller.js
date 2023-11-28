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
import { appendChild } from "./annuals.html.js";
import { getDiary, getAnnuals, setAnnuals } from '../db.js';
import { getMmDd } from '../utils/date-utils.js';
import { redirectTo } from '../init.js';
function onDayChanged(day) {
    redirectTo('/annuals/', new URLSearchParams(`?day=${day}`));
}
function redirectToEntry(day) {
    redirectTo('/entry/', new URLSearchParams(`?day=${day}`));
}
function onEditRequest(day, diary, id) {
    redirectTo('/annuals/', new URLSearchParams(`?id=${id}&day=${day}`));
}
function onChanged(app, user, diary, day, mmDd, annuals) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield setAnnuals(app, user, diary.uri, mmDd, annuals)) {
            redirectToEntry(day);
            return true;
        }
        return false;
    });
}
function switchPage(user, day, annualId) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date(day);
        const mmDd = getMmDd(date);
        document.title = `${mmDd} | Lifetime Journal`;
        const diary = yield getDiary(app, user);
        const { annuals, leapYear } = yield getAnnuals(app, user, diary, date);
        const removeItem = (id) => {
            const newAnnuals = [...annuals];
            newAnnuals.splice(id, 1);
            return onChanged(app, user, diary, day, mmDd, newAnnuals);
        };
        appendChild(
        /*0*/ document.body, 
        /*1*/ day, 
        /*2*/ annuals, 
        /*3*/ leapYear, 
        /*4*/ (day) => onDayChanged(day), 
        /*5*/ (annuals) => onChanged(app, user, diary, day, mmDd, annuals), 
        /*6*/ (id) => onEditRequest(day, diary.uri, id), 
        /*7*/ removeItem, 
        /*8*/ () => redirectToEntry(day), 
        /*9*/ annualId);
    });
}
export { switchPage };
