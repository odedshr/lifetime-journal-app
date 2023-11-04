import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs, setDoc, query, where, Timestamp
} from '@firebase/firestore';
import { FirebaseApp, Settings, Diary, Entry, User, Annual, Period } from './types.js';
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

async function getUserSettings(app: FirebaseApp, user: User): Promise<Settings> {
  const document = await getDoc(doc(collection(getDB(app), getUserId(user)), "settings"));

  if (document.exists()) {
    return document.data() as Settings
  }

  return { diaries: [] };
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
  return annuals.sort((a, b) => a.startYear - b.startYear);
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

async function setPeriod(app: FirebaseApp, user: User, diary: string, id: string | undefined, period: Period | null): Promise<boolean> {
  const docReference = id ?
    doc(collection(getDB(app), getUserId(user)), diary, "period", id) :
    doc(collection(getDB(app), getUserId(user)), diary, "period");

  try {
    if (id !== undefined && period === null) {
      deleteDoc(docReference)
    } else if (period !== null) {
      const record: ({ id?: string, label: string, color?: string, startDate: Date | Timestamp, endDate?: Date | Timestamp }) = { ...period, startDate: Timestamp.fromDate(period.startDate) };
      if (period.endDate) {
        record.endDate = Timestamp.fromDate(period.endDate);
      }
      await setDoc(docReference, record);
    } else {
      throw Error('period is null');
    }

    return true;
  }
  catch (err) {
    return false;
  }
}

function fixMmDdFormat(mmDd: string) {
  return mmDd.replace(/\//g, '-');
}
export {
  getUserSettings,
  saveUserSettings,
  getDefaultFields,
  getDayEntry,
  setDayEntry,
  getAnnuals,
  setAnnuals,
  getPeriods,
  getPeriod,
  setPeriod
};