import {
  addDoc,
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs, setDoc, query, where, Timestamp,
  writeBatch
} from '@firebase/firestore';
import { FirebaseApp, Settings, Diary, DiaryContent, Entry, User, Annual, Period } from './types.js';
import { getMmDd, getShorthandedMonthAndDay, isLeapYear } from './utils/date-utils.js';


let fireStore: Firestore | null = null;

function getDB(app: FirebaseApp): Firestore {
  if (!fireStore) {
    fireStore = getFirestore(app);

    if (location.hostname === 'localhost') {
      connectFirestoreEmulator(fireStore, 'localhost', 8080);
    }
  }

  return fireStore;
}

function getUserId(user: User): string {
  if (!user.email) {
    throw Error('User must have email');
  }
  return user.email.replace(/\./g, '-');
}

function getDefaultFields(diary: Diary) {
  return diary.defaultFields || [{ type: 'text', value: '' }];
}

async function getDayEntry(app: FirebaseApp, user: User, diary: Diary, date: string) {
  const document = await getDoc(doc(collection(getDB(app), getUserId(user)), diary.uri, "entries", date));

  if (document.exists()) {
    return document.data() as Entry
  }
  const fields = getDefaultFields(diary);
  return { date, fields } as Entry;
}

async function setDayEntry(app: FirebaseApp, user: User, diary: string, day: string, entry: Entry): Promise<boolean> {
  try {
    await setDoc(doc(collection(getDB(app), getUserId(user)), diary, "entries", day), entry);
    return true;
  }
  catch (err) {
    return false;
  }
}

const DEFAULT_DIARY: Diary = {
  uri: "diary-01",
  name: "My Diary",
  startDate: "2000-01-01",
  color: "white",
  defaultFields: [{ type: 'text' }]
};

async function getUserSettings(app: FirebaseApp, user: User): Promise<Settings> {
  const document = await getDoc(doc(collection(getDB(app), getUserId(user)), "settings"));

  if (document.exists()) {
    return document.data() as Settings
  }

  return { diaries: [DEFAULT_DIARY], currentDiaryIndex: 0 };
}

async function getDiary(app: FirebaseApp, user: User) {
  const settings = await getUserSettings(app, user);
  return settings.diaries[settings.currentDiaryIndex || 0];

}

async function saveUserSettings(app: FirebaseApp, user: User, settings: Settings) {
  await setDoc(doc(collection(getDB(app), getUserId(user)), "settings"), settings);
}

async function getAnnualsInternal(app: FirebaseApp, user: User, diary: Diary, mmDd: string): Promise<Annual[]> {
  const document = await getDoc(doc(collection(getDB(app), getUserId(user)), diary.uri, "annuals", fixMmDdFormat(mmDd)));

  return (document.exists() ? sortAnnuals(document.data().events) : []) as Annual[];
}

const LEAP_YEAR_ANNUAL = getShorthandedMonthAndDay(new Date(2024, 1, 29));

async function getAnnuals(
  app: FirebaseApp,
  user: User,
  diary: Diary,
  date: Date
): Promise<{ annuals: Annual[], leapYear: Annual[] }> {
  const mmDd = getMmDd(date)
  return {
    annuals: await getAnnualsInternal(app, user, diary, mmDd),
    leapYear: (mmDd !== '02-28' || isLeapYear(new Date(date))) ? [] : (await getAnnualsInternal(app, user, diary, '02-29'))
      .map(annual => ({ ...annual, label: `${annual.label} (${LEAP_YEAR_ANNUAL})` }))
  }
}

function sortAnnuals(annuals: Annual[]): Annual[] {
  return annuals.sort((a, b) => (a.startYear === b.startYear) ? a.label.localeCompare(b.label) : a.startYear - b.startYear);
}

async function setAnnuals(app: FirebaseApp, user: User, diary: string, mmDd: string, annuals: Annual[]): Promise<boolean> {
  try {
    await setDoc(doc(collection(getDB(app), getUserId(user)), diary, "annuals", fixMmDdFormat(mmDd)), { events: annuals });
    return true;
  }
  catch (err) {
    return false;
  }
}

async function getPeriods(app: FirebaseApp, user: User, diary: Diary, date: Date): Promise<Period[]> {
  const documents = await getDocs(
    query(
      collection(getDB(app), getUserId(user), diary.uri, "periods"),
      where("startDate", "<=", Timestamp.fromDate(date))
    ));

  const endDate = date.getTime();

  return documents.docs
    .map(doc => {
      const data = doc.data() as { label: string, startDate: Timestamp, endDate: Timestamp, color: string };
      return {
        ...data,
        id: doc.id,
        startDate: data.startDate.toDate(),
        endDate: data.endDate?.toDate()
      } as Period;
    }).filter(period => !period.endDate || period.endDate.getTime() >= endDate);
};

async function getPeriod(app: FirebaseApp, user: User, diary: Diary, id: string): Promise<Period | null> {
  const document = await getDoc(doc(collection(getDB(app), getUserId(user)), diary.uri, "periods", id));

  return document.exists() ? document.data() as Period : null;
}

async function setPeriod(app: FirebaseApp, user: User, diaryUri: string, id: string | undefined, period: Period | null): Promise<boolean> {
  const record: { [key: string]: any } = {};
  if (period) {
    if (period.startDate) { record.startDate = Timestamp.fromDate(period.startDate); }
    if (period.endDate) { record.endDate = Timestamp.fromDate(period.endDate); }
    if (period.color) { record.color = period.color; }
    if (period.label) { record.label = period.label; }
    if (period.id) { record.id = period.id; }
  }

  try {
    if (id !== undefined) {
      const docReference = doc(collection(getDB(app), getUserId(user)), diaryUri, "periods", id);

      if (period === null) {
        deleteDoc(docReference)
      } else {
        await setDoc(docReference, record);
      }
    } else if (period !== null) {
      await addDoc(collection(getDB(app), getUserId(user), diaryUri, "periods"), record);
    } else {
      throw new Error("missing input: period")
    }
  }
  catch (err) {
    console.error(err);
    throw err;
  }

  return true;
}

function fixMmDdFormat(mmDd: string) {
  return mmDd.replace(/\//g, '-');
}

async function getDiaryContent(app: FirebaseApp,
  user: User,
  diary: Diary): Promise<DiaryContent> {
  const diaryContent: DiaryContent = { settings: diary, entries: {}, annuals: {}, periods: {} };
  const [entries, annuals, periods] = await Promise.all(
    [(getDocs(collection(getDB(app), getUserId(user), diary.uri, 'entries'))),
    (getDocs(collection(getDB(app), getUserId(user), diary.uri, 'annuals'))),
    (getDocs(collection(getDB(app), getUserId(user), diary.uri, 'periods')))]);

  entries.docs.forEach(doc => diaryContent.entries[doc.id] = doc.data() as Entry);
  annuals.docs.forEach(doc => diaryContent.annuals[doc.id] = doc.data() as Annual);
  periods.docs.forEach(doc => diaryContent.periods[doc.id] = doc.data() as Period);

  return diaryContent;
}

async function setDiaryContent(app: FirebaseApp,
  user: User,
  settings: Settings,
  diaryContent: DiaryContent,
  method: "replace" | "merge"): Promise<Settings> {
  const diaryIndex = settings.diaries.findIndex(diary => diary.uri === diaryContent.settings.uri);
  if (diaryIndex === -1) {
    settings.diaries.push(diaryContent.settings);
  } else if (method === "replace") {
    settings.diaries[diaryIndex] = diaryContent.settings;
  } else {
    settings.diaries[diaryIndex] = { ...settings.diaries[diaryIndex], ...diaryContent.settings };
  }

  const diaryUri = diaryContent.settings.uri;
  const batch = writeBatch(getDB(app));
  // const write = method == 'replace' ? batch.set : batch.update;

  batch.set(doc(getDB(app), getUserId(user), "settings"), settings);

  for (let key in diaryContent.entries) {
    batch.set(doc(getDB(app), getUserId(user), diaryUri, "entries", key), diaryContent.entries[key]);
  }

  for (let key in diaryContent.annuals) {
    batch.set(doc(getDB(app), getUserId(user), diaryUri, "annuals", key), diaryContent.annuals[key]);
  }

  for (let key in diaryContent.periods) {
    batch.set(doc(getDB(app), getUserId(user), diaryUri, "periods", key), diaryContent.periods[key]);
  }

  await batch.commit();

  return settings;
}

async function deleteDiaryContent(app: FirebaseApp,
  user: User,
  diaryUri: string) {
  const docReference = doc(collection(getDB(app), getUserId(user)), diaryUri);
  deleteDoc(docReference)
}

export {
  DEFAULT_DIARY,
  getDiary,
  getUserSettings,
  saveUserSettings,
  getDefaultFields,
  getDayEntry,
  setDayEntry,
  getAnnuals,
  setAnnuals,
  getPeriods,
  getPeriod,
  setPeriod,
  getDiaryContent,
  setDiaryContent,
  deleteDiaryContent,
};