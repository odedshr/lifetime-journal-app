import { FirebaseApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { User } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { Firestore, getFirestore, collection, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js'
import { Settings } from './types.js';


function getDB(app: FirebaseApp): Firestore {
  return getFirestore(app);
}

function getUserId(user: User): string {
  return user.email ? user.email.replace(/\./g, '-') : user.uid;
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


export { getUserSettings, saveUserSettings };