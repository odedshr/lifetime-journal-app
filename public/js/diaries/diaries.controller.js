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
import { appendChild } from "./diaries.html.js";
import { DEFAULT_DIARY, getUserSettings, getDiaryContent, setDiaryContent, deleteDiaryContent, saveUserSettings } from '../db.js';
function switchPage(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let settings = yield getUserSettings(app, user);
        document.title = `My Diaries | Lifetime Journal`;
        const onRequestGetDiaryContent = (diary) => __awaiter(this, void 0, void 0, function* () { return yield getDiaryContent(app, user, diary); });
        const onRequestSetDiaryContent = (diaryContent, method) => __awaiter(this, void 0, void 0, function* () {
            settings = (yield setDiaryContent(app, user, settings, diaryContent, method));
            return settings.diaries;
        });
        const onSelectDiary = (diaryIndex) => __awaiter(this, void 0, void 0, function* () {
            settings.currentDiaryIndex = diaryIndex;
            yield saveUserSettings(app, user, settings);
        });
        const onRequestDeleteDiary = (diaryIndex) => __awaiter(this, void 0, void 0, function* () {
            const diaryUri = settings.diaries[diaryIndex].uri;
            settings.diaries = settings.diaries.filter((_, index) => index !== diaryIndex);
            if (settings.diaries.length === 0) {
                settings.diaries.push(DEFAULT_DIARY);
            }
            yield saveUserSettings(app, user, settings);
            yield deleteDiaryContent(app, user, diaryUri);
            return settings.diaries;
        });
        appendChild(document.body, {
            diaries: settings.diaries,
            selected: settings.currentDiaryIndex,
            onRequestGetDiaryContent,
            onRequestSetDiaryContent,
            onRequestDeleteDiary,
            onSelectDiary
        });
    });
}
export { switchPage };
