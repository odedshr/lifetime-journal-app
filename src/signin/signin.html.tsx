import { render } from 'nano-jsx';

type Props = {
  onSignInButtonClicked: () => Promise<boolean>
}

type ElementType = (props: Props) => HTMLElement;


const Element: ElementType = (props) => {
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