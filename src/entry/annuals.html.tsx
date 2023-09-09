import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
import { Annual } from '../types.js';

type ElementType = (props: {
  items: Annual[]
}) => HTMLElement;

const Element: ElementType = (props) => ((<section>
  <div>On this day...</div>
  <ul>
    {props.items.map(item => <li>{item.label}</li>)}
  </ul>
</section>));

function appendChild(parent: HTMLElement, annuals: Annual[]) {
  render(<Element items={annuals} />, parent);
}

export { Element, appendChild };