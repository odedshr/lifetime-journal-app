import {
  Firestore, getFirestore, collection, doc, getDoc, setDoc
} from '@firebase/firestore';
import { FirebaseApp, Settings, Diary, Entry, User, Annual } from './types.js';
import { getMmDd, getShorthandedMonthAndDay, isLeapYear } from './utils/date-utils.js';

function getDB(app: FirebaseApp): Firestore {
  return getFirestore(app);
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

async function getAnnuals(app: FirebaseApp, user: User, diary: Diary, mmDd: string): Promise<Annual[]> {
  const document = await getDoc(doc(collection(getDB(app), getUserId(user)), diary.uri, "annuals", fixMmDdFormat(mmDd)));

  return (document.exists() ? sortAnnuals(document.data().events) : []) as Annual[];
}

const LEAP_YEAR_ANNUAL = getShorthandedMonthAndDay(new Date(2024, 1, 29));

async function getDayAnnuals(
  app: FirebaseApp,
  user: User,
  diary: Diary,
  date: Date
): Promise<{ annuals: Annual[], leapYear: Annual[] }> {
  const mmDd = getMmDd(date)
  return {
    annuals: await getAnnuals(app, user, diary, mmDd),
    leapYear: (mmDd !== '02-28' || isLeapYear(new Date(date))) ? [] : (await getAnnuals(app, user, diary, '02-29'))
      .map(annual => ({ ...annual, label: `${annual.label} (${LEAP_YEAR_ANNUAL})` }))
  }
}

function sortAnnuals(annuals: Annual[]): Annual[] {
  return annuals.sort((a, b) => a.startYear - b.startYear);
}

async function setDayAnnuals(app: FirebaseApp, user: User, diary: string, mmDd: string, annuals: Annual[]): Promise<boolean> {
  try {
    await setDoc(doc(collection(getDB(app), getUserId(user)), diary, "annuals", fixMmDdFormat(mmDd)), { events: annuals });
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
  getDayAnnuals,
  setDayAnnuals
};