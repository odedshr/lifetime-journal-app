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
import { getUserSettings } from '../db.js';
const DEFAULT_DIARY = { uri: "diary-01" };
function switchPage(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = yield getUserSettings(app, user);
        const diary = settings.diaries[0] || DEFAULT_DIARY;
        document.title = `${diary.name || 'My Diary'} | Lifetime Journal`;
        const onRequestData = (itemCount, startAt) => __awaiter(this, void 0, void 0, function* () {
            const data = { type: 'number', min: 0, max: 1, rows: [] };
            const startYear = 1980 + startAt;
            const now = (new Date()).getTime();
            for (let i = 0; i < itemCount; i++) {
                const values = [];
                const year = startYear + i;
                for (let j = 0; j < 12; j++) {
                    values.push({ value: Math.random(), happened: (new Date(year, j, 1).getTime() < now) });
                }
                data.rows.push({ id: i + startAt, label: `${year}`, values });
            }
            return data;
        });
        appendChild(document.body, { onRequestData });
    });
}
export { switchPage };
