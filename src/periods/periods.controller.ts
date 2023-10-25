import { app } from '../firebase.app.js';
import { appendChild } from "./periods.html.js";
import { getUserSettings, getPeriods, setPeriod } from '../db.js';
import { getDisplayableDate } from '../utils/date-utils.js';
import { FirebaseApp, User, Settings, Diary, Period } from '../types.js';
import { redirectTo } from '../init.js';

const DEFAULT_DIARY = { uri: "diary-01" };

function onDayChanged(day: string, diary: string) {
  redirectTo('/periods/', new URLSearchParams(`?day=${day}&diary=${diary}`));
}

function redirectToEntry(day: string, diary: string) {
  redirectTo('/entry/', new URLSearchParams(`?day=${day}&diary=${diary}`));
}

function onEditRequest(day: string, diary: string, id: string) {
  redirectTo('/periods/', new URLSearchParams(`?id=${id}&day=${day}&diary=${diary}`));
}

async function onChanged(app: FirebaseApp, user: User, diary: Diary, day: string, id: string, period: Period | null) {
  if (await setPeriod(app, user, diary.uri, id, period)) {
    redirectToEntry(day, diary.uri);
    return true;
  }
  return false;
}

async function switchPage(user: User, day: string, id?: string) {
  const date = new Date(day);

  document.title = `${getDisplayableDate(date)} | Periods | Lifetime Journal`;
  const settings: Settings = await getUserSettings(app, user);
  const diary = settings.diaries[0] || DEFAULT_DIARY;

  const periods = await getPeriods(app, user, diary, date);

  const removeItem = (id: string) => onChanged(app, user, diary, day, id, null);

  appendChild(document.body, day, periods,
    (day: string) => onDayChanged(day, diary.uri),
    (period: Period) => onChanged(app, user, diary, day, period.id as string, period),
    (id: string) => onEditRequest(day, diary.uri, id),
    removeItem,
    () => redirectToEntry(day, diary.uri),
    id);
}

export { switchPage };