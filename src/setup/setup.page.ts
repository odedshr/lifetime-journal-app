import { app, getAuthenticateUser, signOut } from '../firebase.app.js';
import { deploy as deploySetup } from './setup.html.js';
import { getUserSettings, saveUserSettings } from '../db.js';
import { FirebaseApp, User, Settings, Diary } from '../types.js';

window.addEventListener('load', () => getAuthenticateUser().then(initPage));

async function initPage(user: User) {
  deploy(user, await getUserSettings(app, user));
}

function deploy(user: User, settings: Settings) {
  deploySetup(document.body, {
    onSaveDiary: onSaveDiary.bind({}, app, user, settings), onSignOut: signOut
  });
}

async function onSaveDiary(app: FirebaseApp, user: User, settings: Settings, diary: Diary) {
  settings.diaries.push(diary);
  await saveUserSettings(app, user, settings);
  location.href = '/';
}

function switchPage(user: User, settings: Settings) {
  history.pushState({}, '', '/setup');
  deploy(user, settings);
}

export { switchPage };