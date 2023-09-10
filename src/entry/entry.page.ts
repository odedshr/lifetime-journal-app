import { app, onPageLoadedAndUserAuthenticated, signOut } from '../firebase.app.js';
import { deploy as deployEntry } from './entry.html.js';
import { getUserSettings, getDayEntry, setDayEntry } from '../db.js';
import { FirebaseApp, Settings, User, Entry } from '../types.js';
import { switchPage as switchToSetup } from '../setup/setup.page.js';

const DEFAULT_DIARY = "diary-01";

onPageLoadedAndUserAuthenticated(initPage);

async function initPage(user: User) {
  const settings: Settings = await getUserSettings(app, user);
  if (settings.diaries.length > 0) {
    deploy(user);
  } else {
    switchToSetup(user, settings);
  }
}

async function deploy(user: User) {
  const day = getDateFromURL(window.location.search);
  const entry = await getDayEntry(app, user, DEFAULT_DIARY, day);

  deployEntry(document.body, day, entry, {
    onEntryChanged: (entry: any) => onEntryChanged(app, user, entry),
    onDateChanged: (date: string) => navigateToDay(user, date),
    onSignOut: signOut,
  });
}

async function onEntryChanged(app: FirebaseApp, user: User, entry: Entry) {
  setDayEntry(app, user, DEFAULT_DIARY, entry.date, entry);
}

function getFormattedDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function getDateFromURL(urlSearchParamString: string) {
  return new URLSearchParams(urlSearchParamString).get("day") || getFormattedDate(new Date());
}

function switchPage(user: User) {
  navigateToDay(user, getFormattedDate(new Date()))
}

function navigateToDay(user: User, day: string) {
  history.pushState({}, '', `/entry/?day=${day}`);
  deploy(user);
}

export { switchPage };