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
import { getUserSettings, getDayAnnuals, setDayAnnuals } from '../db.js';
import { getMmDd } from '../utils/date-utils.js';
import { redirectTo } from '../init.js';
const DEFAULT_DIARY = { uri: "diary-01" };
function onDayChanged(day, diary) {
    redirectTo('/annuals/', new URLSearchParams(`?day=${day}&diary=${diary}`));
}
function redirectToEntry(day, diary) {
    redirectTo('/entry/', new URLSearchParams(`?day=${day}&diary=${diary}`));
}
function onEditRequest(day, diary, id) {
    redirectTo('/annuals/', new URLSearchParams(`?id=${id}&day=${day}&diary=${diary}`));
}
function onChanged(app, user, diary, day, mmDd, annuals) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield setDayAnnuals(app, user, diary.uri, mmDd, annuals)) {
            redirectToEntry(day, diary.uri);
            return true;
        }
        return false;
    });
}
function switchPage(user, day, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date(day);
        const mmDd = getMmDd(date);
        document.title = `${mmDd} | Lifetime Journal`;
        const settings = yield getUserSettings(app, user);
        const diary = settings.diaries[0] || DEFAULT_DIARY;
        const { annuals, leapYear } = yield getDayAnnuals(app, user, diary, date);
        const removeItem = (id) => {
            const newAnnuals = [...annuals];
            newAnnuals.splice(id, 1);
            return onChanged(app, user, diary, day, mmDd, newAnnuals);
        };
        appendChild(document.body, day, annuals, leapYear, (day) => onDayChanged(day, diary.uri), (annuals) => onChanged(app, user, diary, day, mmDd, annuals), (id) => onEditRequest(day, diary.uri, id), removeItem, () => redirectToEntry(day, diary.uri), id);
    });
}
export { switchPage };
