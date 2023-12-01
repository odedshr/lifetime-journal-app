import { getAuthenticateUser, signOut } from "./firebase.app.js";
import { getFormattedDate, isDateStringValid } from "./utils/date-utils.js";
import { switchPage as switchToSignInPage } from "./signin/signin.controller.js";
import { switchPage as switchToEntryPage } from "./entry/entry.controller.js";
import { switchPage as switchToAnnualsPage } from "./annuals/annuals.controller.js";
import { switchPage as switchToOverviewPage } from "./overview/overview.controller.js";
import { switchPage as switchToDiariesPage } from "./diaries/diaries.controller.js";
import { switchPage as switchToPageNotFound } from "./404/404.controller.js";
import { User } from "./types.js";

async function init(url: string, parameters: URLSearchParams = new URLSearchParams()): Promise<void> {
  const user: User | null = await getAuthenticateUser().catch(() => null);
  if (!user) {
    return await switchToSignInPage();
  }

  if (url.match(/\/signout\/?/)) {
    signOut();
    return await redirectTo('/');
  }

  if (url.match(/\/overview\/?/)) {
    return await switchToOverviewPage(user);
  }

  if (url.match(/\/diaries\/?/)) {
    return await switchToDiariesPage(user);
  }

  let day = parameters.get('day') || '';

  if (url === '/') {
    url = '/entry/';
  }

  if (['/annuals/', '/periods/', '/entry/'].indexOf(url) >= 0 && !isDateStringValid(day)) {
    parameters.set('day', getFormattedDate(new Date()));
    return await redirectTo(url, parameters);
  }

  if (url === '/annuals/') {
    const id = parameters.get('id');
    return await switchToAnnualsPage(user, day, id ? +id : undefined);
  }

  if (url === '/' || url === '/entry/') {
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