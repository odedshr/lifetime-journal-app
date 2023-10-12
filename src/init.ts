import { getAuthenticateUser, signOut } from "./firebase.app.js";
import { getFormattedDate, isDateStringValid } from "./utils/date-utils.js";
import { switchPage as switchToSignInPage } from "./signin/signin.controller.js";
import { switchPage as switchToEntryPage } from "./entry/entry.controller.js";
import { switchPage as switchToAnnualsPage } from "./annuals/annuals.controller.js";
import { switchPage as switchToPageNotFound } from "./404/404.controller.js";
import { User } from "./types.js";

async function init(url: string, parameters: URLSearchParams = new URLSearchParams()): Promise<void> {
  const user: User | null = await getAuthenticateUser().catch(() => null);

  if (!user) {
    return await switchToSignInPage();
  }

  if (url === '/signout/') {
    signOut();
    return await redirectTo('/');
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
      return await redirectTo(url, parameters);
    }
    const id = parameters.get('id');
    return await switchToAnnualsPage(user, day, id ? +id : undefined);
  }


  if (url === '/' || url === '/entry/') {
    if (!isDateStringValid(day)) {
      parameters.set('day', getFormattedDate(new Date()));

      return await redirectTo('/entry/', parameters);
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