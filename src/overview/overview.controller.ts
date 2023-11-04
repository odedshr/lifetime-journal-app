import { app } from '../firebase.app.js';
import { appendChild, Data } from "./overview.html.js";
import { getUserSettings } from '../db.js';
import { User, Settings } from '../types.js';

const DEFAULT_DIARY = { uri: "diary-01" };

async function switchPage(user: User) {
  const settings: Settings = await getUserSettings(app, user);
  const diary = settings.diaries[0] || DEFAULT_DIARY;
  document.title = `${diary.name || 'My Diary'} | Lifetime Journal`;

  const onRequestData = async (itemCount: number, startAt: number) => {
    const data: Data<number> = { type: 'number', min: 0, max: 1, rows: [] };
    const startYear = 1980 + startAt;
    const now = (new Date()).getTime();

    for (let i = 0; i < itemCount; i++) {
      const values = [];
      const year = startYear + i;
      for (let j = 0; j < 12; j++) {
        values.push({ value: Math.random(), happened: (new Date(year, j, 1).getTime() < now) });
      }
      data.rows.push({ id: i + startAt, label: `${year}`, values });
    }
    return data;
  }


  appendChild(document.body, { onRequestData });
}

export { switchPage };