import { getAuthenticateUser, signOut } from "./firebase.app.js";
import { getFormattedDate } from "./utils/date-utils.js";
import { switchPage as switchToSignInPage } from "./signin/signin.controller.js";
import { switchPage as switchToEntryPage } from "./entry/entry.controller.js";

async function init(url: string, parameters: URLSearchParams = new URLSearchParams()) {
  const user = await getAuthenticateUser().catch(() => {
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
    day = getFormattedDate(new Date())
    navToUrl('/entry/?day=' + day);
  }

  switchToEntryPage(user, day);
}


function navToUrl(url: string) {
  history.pushState({}, '', url);
}


window.addEventListener('load', () => init(location.pathname, new URLSearchParams(location.search)))
export { init };