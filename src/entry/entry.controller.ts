import { app } from '../firebase.app.js';
import { appendChild } from "./entry.html.js";
import { getUserSettings, getDayEntry, setDayEntry, getDayAnnuals } from '../db.js';
import { getDisplayableDate, getMmDd } from '../utils/date-utils.js';
import { FirebaseApp, User, Settings, Diary, Entry } from '../types.js';
import { redirectTo } from '../init.js';

const DEFAULT_DIARY = { uri: "diary-01" };

function onDayChanged(day: string, diary: string) {
  redirectTo('/entry/', new URLSearchParams(`?day=${day}&diary=${diary}`));
}

function onAnnualEditRequest(day: string, diary: string, id?: number) {
  redirectTo('/annuals/', new URLSearchParams(`?${id !== undefined ? `id=${id}&` : ''}day=${day}&diary=${diary}`));
}

async function onEntryChanged(app: FirebaseApp, user: User, diary: Diary, entry: Entry) {
  return setDayEntry(app, user, diary.uri, entry.date, entry);
}

async function switchPage(user: User, day: string) {
  const date = new Date(day);
  document.title = `${getDisplayableDate(date)} | Lifetime Journal`;
  const settings: Settings = await getUserSettings(app, user);
  const diary = settings.diaries[0] || DEFAULT_DIARY;

  const entry = await getDayEntry(app, user, diary, day);
  const { annuals, leapYear } = await getDayAnnuals(app, user, diary, date);

  appendChild(document.body, day, entry, annuals, leapYear,
    (day: string) => onDayChanged(day, diary.uri),
    (entry: Entry) => onEntryChanged(app, user, diary, entry),
    (id?: number) => onAnnualEditRequest(day, diary.uri, id));
}

export { switchPage };