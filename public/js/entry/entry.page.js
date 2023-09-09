var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { app, onPageLoadedAndUserAuthenticated, signOut } from '../firebase.app.js';
import { deploy as deployEntry } from './entry.html.js';
import { getUserSettings } from '../db.js';
import { switchPage as switchToSetup } from '../setup/setup.page.js';
onPageLoadedAndUserAuthenticated(initPage);
function initPage(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = yield getUserSettings(app, user);
        if (settings.diaries.length > 0) {
            deploy(user);
        }
        else {
            switchToSetup(user, settings);
        }
    });
}
function deploy(user) {
    deployEntry(document.body, {
        onEntrySaved: entry => onEntrySaved(app, user, entry), onSignOut: signOut
    });
}
function onEntrySaved(app, user, entry) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('saving entry');
    });
}
function getFormattedDate(date) {
    return date.toISOString().split('T')[0];
}
function switchPage(user) {
    history.pushState({}, '', `/entry/?${getFormattedDate(new Date())}`);
    deploy(user);
}
export { switchPage };
