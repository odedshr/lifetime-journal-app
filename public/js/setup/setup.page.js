var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { app, getAuthenticateUser, signOut, switchToSignOutPage } from '../firebase.app.js';
import { deploy as deploySetup } from './setup.html.js';
import { getUserSettings, saveUserSettings } from '../db.js';
window.addEventListener('load', () => getAuthenticateUser().then(initPage).catch(switchToSignOutPage));
function initPage(user) {
    return __awaiter(this, void 0, void 0, function* () {
        deploy(user, yield getUserSettings(app, user));
    });
}
function deploy(user, settings) {
    deploySetup(document.body, {
        onSaveDiary: onSaveDiary.bind({}, app, user, settings), onSignOut: signOut
    });
}
function onSaveDiary(app, user, settings, diary) {
    return __awaiter(this, void 0, void 0, function* () {
        settings.diaries.push(diary);
        yield saveUserSettings(app, user, settings);
        location.href = '/';
    });
}
function switchPage(user, settings) {
    history.pushState({}, '', '/setup');
    deploy(user, settings);
}
export { switchPage };
