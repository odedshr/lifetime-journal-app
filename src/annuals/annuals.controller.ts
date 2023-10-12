import { app } from '../firebase.app.js';
import { appendChild } from "./annuals.html.js";
import { getUserSettings, getDayAnnuals, setDayAnnuals } from '../db.js';
import { getMmDd } from '../utils/date-utils.js';
import { FirebaseApp, User, Settings, Diary, Annual } from '../types.js';
import { redirectTo } from '../init.js';

const DEFAULT_DIARY = { uri: "diary-01" };

function onDayChanged(day: string, diary: string) {
  redirectTo('/annuals/', new URLSearchParams(`?day=${day}&diary=${diary}`));
}

function redirectToEntry(day: string, diary: string) {
  redirectTo('/entry/', new URLSearchParams(`?day=${day}&diary=${diary}`));
}

function onEditRequest(day: string, diary: string, id: number) {
  redirectTo('/annuals/', new URLSearchParams(`?id=${id}&day=${day}&diary=${diary}`));
}

async function onChanged(app: FirebaseApp, user: User, diary: Diary, day: string, mmDd: string, annuals: Annual[]) {
  if (await setDayAnnuals(app, user, diary.uri, mmDd, annuals)) {
    redirectToEntry(day, diary.uri);
    return true;
  }
  return false;
}

async function switchPage(user: User, day: string, id?: number) {
  const date = new Date(day);
  const mmDd = getMmDd(date);

  document.title = `${mmDd} | Lifetime Journal`;
  const settings: Settings = await getUserSettings(app, user);
  const diary = settings.diaries[0] || DEFAULT_DIARY;

  const { annuals, leapYear } = await getDayAnnuals(app, user, diary, date);

  const removeItem = (id: number) => {
    const newAnnuals = [...annuals];
    newAnnuals.splice(id, 1);
    return onChanged(app, user, diary, day, mmDd, newAnnuals)
  }

  appendChild(document.body, day, annuals, leapYear,
    (day: string) => onDayChanged(day, diary.uri),
    (annuals: Annual[]) => onChanged(app, user, diary, day, mmDd, annuals),
    (id: number) => onEditRequest(day, diary.uri, id),
    removeItem,
    () => redirectToEntry(day, diary.uri),
    id);
}

export { switchPage };