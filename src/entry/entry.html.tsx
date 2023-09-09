import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
import { Element as Annuals } from './annuals.html.js';
import { Entry, Annual } from '../types.js';

type ElementType = (props: {
  annuals: Annual[]
}) => HTMLElement;

const Element: ElementType = (props) => (<form>
  item1
  <Annuals items={props.annuals} />
  item 2
</form>)

function appendChild(parent: HTMLElement, annuals: Annual[]) {
  render(<Element annuals={annuals} />, parent);
}

function deploy(parent: HTMLElement, delegates: {
  onEntrySaved: ((entry: Entry) => void),
  onSignOut: (() => void)
}) {
  appendChild(parent, [])
}

export { deploy };