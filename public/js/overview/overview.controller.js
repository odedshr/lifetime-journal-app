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
import { appendChild } from "./overview.html.js";
import { getDiary } from '../db.js';
import { addToDate } from '../utils/date-utils.js';
function switchPage(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const diary = yield getDiary(app, user);
        document.title = `${diary.name || 'My Diary'} | Lifetime Journal`;
        const onRequestData = (itemCount, startAt) => __awaiter(this, void 0, void 0, function* () {
            const data = { type: 'number', days: [], now: new Date() };
            const startYear = 1980 + startAt;
            let date = new Date(startYear, 0, 1);
            for (let i = 0; i < itemCount; i++) {
                const year = startYear + i;
                for (let j = 0; j < 12; j++) {
                    data.days.push({ value: Math.random(), date });
                }
                date = addToDate(date, 1);
            }
            return data;
        });
        appendChild(document.body, { onRequestData });
    });
}
export { switchPage };
