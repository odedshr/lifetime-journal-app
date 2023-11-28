import { app } from '../firebase.app.js';
import { appendChild } from "./periods.html.js";
import { getDiary, getPeriods, setPeriod } from '../db.js';
import { getDisplayableDate } from '../utils/date-utils.js';
import { FirebaseApp, User, Diary, Period } from '../types.js';
import { redirectTo } from '../init.js';

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

async function switchPage(user: User, day: string, periodId?: string) {
  const date = new Date(day);

  document.title = `${getDisplayableDate(date)} | Periods | Lifetime Journal`;
  const diary = await getDiary(app, user);

  const periods = await getPeriods(app, user, diary, date);

  const removeItem = (id: string) => onChanged(app, user, diary, day, id, null);

  appendChild(
    /*0*/document.body,
    /*1*/day,
    /*2*/periods,
    /*3*/(day: string) => onDayChanged(day, diary.uri),
    /*4*/(period: Period) => onChanged(app, user, diary, day, period.id as string, period),
    /*5*/(id: string) => onEditRequest(day, diary.uri, id),
    /*6*/removeItem,
    /*7*/() => redirectToEntry(day, diary.uri),
    /*8*/periodId);
}

export { switchPage };