import { app, onPageLoadedAndUserAuthenticated, signOut } from '../firebase.app.js';
import { deploy as deployEntry } from './entry.html.js';
import { getUserSettings } from '../db.js';
import { FirebaseApp, Settings, User } from '../types.js';
import { switchPage as switchToSetup } from '../setup/setup.page.js';

onPageLoadedAndUserAuthenticated(initPage);

async function initPage(user: User) {
  const settings: Settings = await getUserSettings(app, user);
  if (settings.diaries.length > 0) {
    deploy(user);
  } else {
    switchToSetup(user, settings);
  }
}

function deploy(user: User) {
  const day = getDateFromURL(window.location.search);

  console.log(`Loading entry for ${day}...`);

  deployEntry(document.body, {
    onEntrySaved: entry => onEntrySaved(app, user, entry), onSignOut: signOut
  });
}

async function onEntrySaved(app: FirebaseApp, user: User, entry: any) {
  console.log('saving entry');
}

function getFormattedDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function getDateFromURL(urlSearchParamString: string) {
  return new URLSearchParams(urlSearchParamString).get("day") || getFormattedDate(new Date());
}

function switchPage(user: User) {
  history.pushState({}, '', `/entry/?day=${getFormattedDate(new Date())}`);
  deploy(user);
}

export { switchPage };