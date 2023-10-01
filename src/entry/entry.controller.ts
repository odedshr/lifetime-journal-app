import { app } from '../firebase.app.js';
import { appendChild } from "./entry.html.js";
import { getUserSettings, getDayEntry, setDayEntry } from '../db.js';
import { getDisplayableDate } from '../utils/date-utils.js';
import { FirebaseApp, User, Settings, Diary, Entry } from '../types.js';
import { redirectTo } from '../init.js';

const DEFAULT_DIARY = { uri: "diary-01" };

function onDayChanged(day: string, diary: string) {
  redirectTo('/entry/', new URLSearchParams(`?day=${day}&diary=${diary}`));
}

async function onEntryChanged(app: FirebaseApp, user: User, diary: Diary, entry: Entry) {
  return setDayEntry(app, user, diary.uri, entry.date, entry);
}

async function switchPage(user: User, day: string) {
  document.title = `${getDisplayableDate(new Date(day))} | Lifetime Journal`;
  const settings: Settings = await getUserSettings(app, user);
  const diary = settings.diaries[0] || DEFAULT_DIARY;

  const entry = await getDayEntry(app, user, diary, day);

  appendChild(document.body, day, entry, (day: string) => onDayChanged(day, diary.uri), (entry: Entry) => onEntryChanged(app, user, diary, entry), []);
}

export { switchPage };