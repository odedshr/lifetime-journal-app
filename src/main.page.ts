import { app, getAuthenticateUser, switchToSignOutPage } from './firebase.app.js';
import { getUserSettings } from './db.js';
import { Settings, User } from './types.js';
import { switchPage as switchToSetup } from './setup/setup.page.js';
import { switchPage as switchToEntry } from './entry/entry.page.js';

window.addEventListener('load', () => getAuthenticateUser().then(initPage).catch(switchToSignOutPage));

async function initPage(user: User) {
  const settings: Settings = await getUserSettings(app, user);
  if (settings.diaries.length > 0) {
    switchToEntry(user);
  } else {
    switchToSetup(user, settings);
  }
}

export { initPage };