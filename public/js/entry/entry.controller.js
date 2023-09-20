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
import { getUserSettings, getDayEntry, setDayEntry } from '../db.js';
import { getDisplayableDate } from '../utils/date-utils.js';
import { init } from '../init.js';
const DEFAULT_DIARY = "diary-01";
function onDayChanged(day, diary) {
    init('/entry/', new URLSearchParams(`?day=${day}&diary=${diary}`));
}
function onEntryChanged(app, user, entry) {
    return __awaiter(this, void 0, void 0, function* () {
        return setDayEntry(app, user, DEFAULT_DIARY, entry.date, entry);
    });
}
function switchPage(user, day) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        document.title = `${getDisplayableDate(new Date(day))} | Lifetime Journal`;
        const settings = yield getUserSettings(app, user);
        const diaryUri = ((_a = settings.diaries[0]) === null || _a === void 0 ? void 0 : _a.uri) || DEFAULT_DIARY;
        const entry = yield getDayEntry(app, user, diaryUri, day);
        appendChild(document.body, day, entry, (day) => onDayChanged(day, diaryUri), (entry) => onEntryChanged(app, user, entry), []);
    });
}
export { switchPage };
