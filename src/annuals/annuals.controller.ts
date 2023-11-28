import { app } from '../firebase.app.js';
import { appendChild } from "./annuals.html.js";
import { getDiary, getAnnuals, setAnnuals } from '../db.js';
import { getMmDd } from '../utils/date-utils.js';
import { FirebaseApp, User, Diary, Annual } from '../types.js';
import { redirectTo } from '../init.js';

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
  if (await setAnnuals(app, user, diary.uri, mmDd, annuals)) {
    redirectToEntry(day, diary.uri);
    return true;
  }
  return false;
}

async function switchPage(user: User, day: string, annualId?: number) {
  const date = new Date(day);
  const mmDd = getMmDd(date);

  document.title = `${mmDd} | Lifetime Journal`;
  const diary = await getDiary(app, user);

  const { annuals, leapYear } = await getAnnuals(app, user, diary, date);

  const removeItem = (id: number) => {
    const newAnnuals = [...annuals];
    newAnnuals.splice(id, 1);
    return onChanged(app, user, diary, day, mmDd, newAnnuals)
  }

  appendChild(
    /*0*/document.body,
    /*1*/day,
    /*2*/annuals,
    /*3*/leapYear,
    /*4*/(day: string) => onDayChanged(day, diary.uri),
    /*5*/(annuals: Annual[]) => onChanged(app, user, diary, day, mmDd, annuals),
    /*6*/(id: number) => onEditRequest(day, diary.uri, id),
    /*7*/removeItem,
    /*8*/() => redirectToEntry(day, diary.uri),
    /*9*/annualId);
}

export { switchPage };