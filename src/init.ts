import { getAuthenticateUser, signOut } from "./firebase.app.js";
import { getFormattedDate } from "./utils/date-utils.js";
import { switchPage as switchToSignInPage } from "./signin/signin.controller.js";
import { switchPage as switchToEntryPage } from "./entry/entry.controller.js";
import { switchPage as switchToPageNotFound } from "./404/404.controller.js";

async function init(url: string, parameters: URLSearchParams = new URLSearchParams()): Promise<void> {
  const user = await getAuthenticateUser().catch(() => {
    if (url !== '/') {
      return redirectTo('/');
    }

    return switchToSignInPage();
  });

  if (!user) {
    return;
  }

  if (url === '/signout/') {
    signOut();
    return await redirectTo('/');
  }

  if (url === '/overview/') {
    // switchToOverviewPage
  }

  if (url === '/diaries/') {
    // switchToDiariesPage
  }

  if (url === '/' || url === '/entry/') {
    let day = parameters.get('day') || '';
    // if day doesn't match yyyy-mm-dd format then get today's date
    if (/^\d{4}\-\d{2}\-\d{2}$/.exec(day) === null) {
      day = getFormattedDate(new Date())
      return await redirectTo('/entry/', new URLSearchParams(`day=${day}`));
    }

    return await switchToEntryPage(user, day);
  }

  return await switchToPageNotFound();
}


async function redirectTo(url: string, parameters: URLSearchParams = new URLSearchParams()): Promise<void> {
  history.pushState({}, '', `${url}?${parameters.toString()}`);
  return init(url, parameters);
}


window.addEventListener('load', () => init(location.pathname, new URLSearchParams(location.search)))
export { init, redirectTo };