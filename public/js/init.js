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
import { getFormattedDate } from "./utils/date-utils.js";
import { switchPage as switchToSignInPage } from "./signin/signin.controller.js";
import { switchPage as switchToEntryPage } from "./entry/entry.controller.js";
function init(url, parameters = new URLSearchParams()) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getAuthenticateUser().catch(() => {
            if (url !== '/') {
                navToUrl('/');
            }
            switchToSignInPage();
        });
        if (!user) {
            return;
        }
        if (url === '/signout/') {
            signOut();
            navToUrl('/');
            return switchToSignInPage();
        }
        if (url === '/overview/') {
            // switchToOverviewPage
        }
        if (url === '/diaries/') {
            // switchToDiariesPage
        }
        if (url !== '/entry/') {
            navToUrl('/entry');
        }
        let day = parameters.get('day') || '';
        // if day doesn't match yyyy-mm-dd format then get today's date
        if (/^\d{4}\-\d{2}\-\d{2}$/.exec(day) === null) {
            day = getFormattedDate(new Date());
            navToUrl('/entry/?day=' + day);
        }
        switchToEntryPage(user, day);
    });
}
function navToUrl(url) {
    history.pushState({}, '', url);
}
window.addEventListener('load', () => init(location.pathname, new URLSearchParams(location.search)));
export { init };
