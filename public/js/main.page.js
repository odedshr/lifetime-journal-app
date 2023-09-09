var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { app, onPageLoadedAndUserAuthenticated } from './firebase.app.js';
import { getUserSettings } from './db.js';
import { switchPage as switchToSetup } from './setup/setup.page.js';
import { switchPage as switchToEntry } from './entry/entry.page.js';
onPageLoadedAndUserAuthenticated(initPage);
function initPage(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = yield getUserSettings(app, user);
        if (settings.diaries.length > 0) {
            switchToEntry(user);
        }
        else {
            switchToSetup(user, settings);
        }
    });
}
