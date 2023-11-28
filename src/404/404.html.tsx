import { render } from 'nano-jsx';
import { ElementType } from '../types.js';

type Props = {}

const Element: ElementType<Props> = (props) => {
  return (<main class="page-not-found">
    <h1>404: Page Not Found</h1>
    <h2>Not all those who wander are lost</h2>
    <p>The specified file was not found on this website. Please check the URL for mistakes and try again.</p>
  </main>)
};

function appendChild(parent: HTMLElement, props: Props = {}) {
  render(<Element />, parent);
}

export { appendChild };