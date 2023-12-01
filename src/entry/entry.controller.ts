import { app } from '../firebase.app.js';
import { appendChild } from "./entry.html.js";
import { getDiary, getDefaultFields, getDayEntry, setDayEntry, getAnnuals, getPeriods, setPeriod } from '../db.js';
import { getDisplayableDate } from '../utils/date-utils.js';
import { FirebaseApp, User, Period, Diary, Entry } from '../types.js';
import { redirectTo } from '../init.js';

function onDayChanged(day: string, diary: string) {
  redirectTo('/entry/', new URLSearchParams(`?day=${day}`));
}

function onAnnualEditRequest(day: string, diary: string, id?: number) {
  redirectTo('/annuals/', new URLSearchParams(`?${id !== undefined ? `id=${id}&` : ''}day=${day}`));
}

async function onEntryChanged(app: FirebaseApp, user: User, diary: Diary, entry: Entry) {
  return setDayEntry(app, user, diary.uri, entry.date, entry);
}

async function onPeriodChanged(app: FirebaseApp, user: User, date: Date, diary: Diary, period: Period | null, id?: string): Promise<Period[] | Error> {
  const result = await setPeriod(app, user, diary.uri, id, period).catch((err: Error) => err);
  return ("boolean" === typeof result) ? await getPeriods(app, user, diary, date) : result;
}

async function switchPage(user: User, dateString: string) {
  const date = new Date(dateString);
  document.title = `${getDisplayableDate(date)} | Lifetime Journal`;
  const diary = await getDiary(app, user);

  const entry = await getDayEntry(app, user, diary, dateString);
  const isEditMode = entry.fields === getDefaultFields(diary);
  const { annuals, leapYear } = await getAnnuals(app, user, diary, date);
  const periods = await getPeriods(app, user, diary, date);

  appendChild(document.body, {
    date: dateString,
    entry,
    annuals,
    leapYearAnnuals: leapYear,
    periods,
    onDayChanged: (day: string) => onDayChanged(day, diary.uri),
    onEntryChanged: (entry: Entry) => onEntryChanged(app, user, diary, entry),
    onAnnualEditRequest: (id?: number) => onAnnualEditRequest(dateString, diary.uri, id),
    onPeriodChanged: (period: Period | null, id?: string) => onPeriodChanged(app, user, date, diary, period, id),
    isEditMode
  }
  );
}

export { switchPage };