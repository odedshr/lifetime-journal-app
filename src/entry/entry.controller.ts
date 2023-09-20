import { app } from '../firebase.app.js';
import { appendChild } from "./entry.html.js";
import { getUserSettings, getDayEntry, setDayEntry } from '../db.js';
import { getDisplayableDate } from '../utils/date-utils.js';
import { FirebaseApp, User, Settings, Entry } from '../types.js';
import { init } from '../init.js';

const DEFAULT_DIARY = "diary-01";

function onDayChanged(day: string, diary: string) {
  init('/entry/', new URLSearchParams(`?day=${day}&diary=${diary}`));
}

async function onEntryChanged(app: FirebaseApp, user: User, entry: Entry) {
  return setDayEntry(app, user, DEFAULT_DIARY, entry.date, entry);
}

async function switchPage(user: User, day: string) {
  document.title = `${getDisplayableDate(new Date(day))} | Lifetime Journal`;
  const settings: Settings = await getUserSettings(app, user);
  const diaryUri = settings.diaries[0]?.uri || DEFAULT_DIARY;
  const entry = await getDayEntry(app, user, diaryUri, day);

  appendChild(document.body, day, entry, (day: string) => onDayChanged(day, diaryUri), (entry: Entry) => onEntryChanged(app, user, entry), []);
}

export { switchPage };