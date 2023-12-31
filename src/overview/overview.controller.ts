import { app } from '../firebase.app.js';
import { appendChild, Data } from "./overview.html.js";
import { getDiary } from '../db.js';
import { addToDate } from '../utils/date-utils.js';
import { User } from '../types.js';

async function switchPage(user: User) {
  const diary = await getDiary(app, user);
  document.title = `${diary.name || 'My Diary'} | Lifetime Journal`;

  const onRequestData = async (itemCount: number, startAt: number) => {
    const data: Data<number> = { type: 'number', days: [], now: new Date() };
    const startYear = 1980 + startAt;
    let date = new Date(startYear, 0, 1);

    for (let i = 0; i < itemCount; i++) {
      const year = startYear + i;
      for (let j = 0; j < 12; j++) {
        data.days.push({ value: Math.random(), date });
      }
      date = addToDate(date, 1);
    }
    return data;
  }


  appendChild(document.body, { onRequestData });
}

export { switchPage };