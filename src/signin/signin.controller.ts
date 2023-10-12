import { signIn } from '../firebase.app.js';
import { appendChild } from "./signin.html.js";
import { init as initApp } from '../init.js';


async function onSignInButtonClicked(): Promise<boolean> {
  const result = await signIn();

  if (result) {
    await initApp('/');
  }

  return result;
}

function switchPage() {
  document.title = 'Sign in | Lifetime Journal';
  appendChild(document.body, { onSignInButtonClicked });
}

export { switchPage };