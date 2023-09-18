import {
  Firestore, getFirestore, collection, doc, getDoc, setDoc
} from '@firebase/firestore';
import { FirebaseApp, Settings, Entry, Field, User } from './types.js';


function getDB(app: FirebaseApp): Firestore {
  return getFirestore(app);
}

function getUserId(user: User): string {
  if (!user.email) {
    throw Error('User must have email');
  }
  return user.email.replace(/\./g, '-');
}

async function getDayEntry(app: FirebaseApp, user: User, diary: string, date: string) {
  const document = await getDoc(doc(collection(getDB(app), getUserId(user)), diary, "entries", date));

  if (document.exists()) {
    return document.data() as Entry
  }
  const defaultField: Field<string> = { type: 'text', value: '' };
  return { date, fields: [defaultField] };
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


export { getUserSettings, saveUserSettings, getDayEntry, setDayEntry };