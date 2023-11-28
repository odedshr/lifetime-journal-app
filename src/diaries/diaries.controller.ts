import { app } from '../firebase.app.js';
import { appendChild } from "./diaries.html.js";
import { DEFAULT_DIARY, getUserSettings, getDiaryContent, setDiaryContent, deleteDiaryContent, saveUserSettings } from '../db.js';
import { User, Settings, Diary, DiaryContent } from '../types.js';


async function switchPage(user: User) {
  let settings: Settings = await getUserSettings(app, user);
  document.title = `My Diaries | Lifetime Journal`;

  const onRequestGetDiaryContent = async (diary: Diary) => await getDiaryContent(app, user, diary);

  const onRequestSetDiaryContent = async (diaryContent: DiaryContent, method: 'replace' | 'merge') => {
    settings = (await setDiaryContent(app, user, settings, diaryContent, method));
    return settings.diaries;
  }
  const onSelectDiary = async (diaryIndex: number) => {
    settings.currentDiaryIndex = diaryIndex;
    await saveUserSettings(app, user, settings);
  }
  const onRequestDeleteDiary = async (diaryIndex: number) => {
    const diaryUri = settings.diaries[diaryIndex].uri;

    settings.diaries = settings.diaries.filter((_, index) => index !== diaryIndex);
    if (settings.diaries.length === 0) {
      settings.diaries.push(DEFAULT_DIARY);
    }
    await saveUserSettings(app, user, settings);
    await deleteDiaryContent(app, user, diaryUri);
    return settings.diaries;
  }

  appendChild(document.body, {
    diaries: settings.diaries,
    selected: settings.currentDiaryIndex,
    onRequestGetDiaryContent,
    onRequestSetDiaryContent,
    onRequestDeleteDiary,
    onSelectDiary
  });
}

export { switchPage };