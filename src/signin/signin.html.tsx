import { render } from 'nano-jsx';
import { ElementType } from '../types.js';

type Props = {
  onSignInButtonClicked: () => Promise<boolean>
}



const Element: ElementType<Props> = (props) => {
  let signInButton: HTMLButtonElement;

  const onClick = async () => {
    signInButton.setAttribute('disabled', 'true');
    await props.onSignInButtonClicked();
    signInButton.removeAttribute('disabled');
  }

  return (<main class="signin">
    <h1>Lifetime Journal</h1>
    <form>
      <button
        type="button"
        class="button-sign-in"
        onClick={onClick}
        id="btnSignIn"
        ref={(el: HTMLButtonElement) => signInButton = el}
      ><span>Sign in with Google</span></button>
    </form>
  </main>)
};

function appendChild(parent: HTMLElement, props: Props) {
  render(<Element onSignInButtonClicked={props.onSignInButtonClicked} />, parent);
}

export { appendChild };