var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAuthenticateUser, signOut } from "./firebase.app.js";
import { getFormattedDate, isDateStringValid } from "./utils/date-utils.js";
import { switchPage as switchToSignInPage } from "./signin/signin.controller.js";
import { switchPage as switchToEntryPage } from "./entry/entry.controller.js";
import { switchPage as switchToAnnualsPage } from "./annuals/annuals.controller.js";
import { switchPage as switchToPageNotFound } from "./404/404.controller.js";
function init(url, parameters = new URLSearchParams()) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getAuthenticateUser().catch(() => null);
        if (!user) {
            return yield switchToSignInPage();
        }
        if (url === '/signout/') {
            signOut();
            return yield redirectTo('/');
        }
        // if (url === '/overview/') {
        //   // switchToOverviewPage
        // }
        // if (url === '/diaries/') {
        //   // switchToDiariesPage
        // }
        let day = parameters.get('day') || '';
        if (url === '/annuals/') {
            if (!isDateStringValid(day)) {
                parameters.set('day', getFormattedDate(new Date()));
                return yield redirectTo(url, parameters);
            }
            const id = parameters.get('id');
            return yield switchToAnnualsPage(user, day, id ? +id : undefined);
        }
        if (url === '/' || url === '/entry/') {
            if (!isDateStringValid(day)) {
                parameters.set('day', getFormattedDate(new Date()));
                return yield redirectTo('/entry/', parameters);
            }
            return yield switchToEntryPage(user, day);
        }
        return yield switchToPageNotFound();
    });
}
function redirectTo(url, parameters = new URLSearchParams()) {
    return __awaiter(this, void 0, void 0, function* () {
        history.pushState({}, '', `${url}?${parameters.toString()}`);
        return init(url, parameters);
    });
}
window.addEventListener('load', () => init(location.pathname, new URLSearchParams(location.search)));
export { init, redirectTo };
