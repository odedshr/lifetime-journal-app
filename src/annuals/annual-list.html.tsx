import { render } from 'nano-jsx';
import { Element as AnnualItem } from './annual-item.html.js';
import { Annual } from '../types.js';

type ElementType = (props: {
  date: string;
  items: Annual[];
  readonly: Annual[];
  onEditRequest: (id: number) => void;

}) => HTMLElement;

const Element: ElementType = (props) => (
  <ul class="annuals">
    {props.items.map(
      (item, id) => <AnnualItem date={props.date} data={item}
        onEditRequest={() => props.onEditRequest(id)} />)}
    {props.readonly.map(
      item => <AnnualItem date={props.date} data={item} />)}
  </ul>);

function appendChild(parent: HTMLElement, date: string, annuals: Annual[], readonly: Annual[], onEditRequest: (id: number) => void) {
  render(<Element items={annuals} readonly={readonly} date={date} onEditRequest={onEditRequest} />, parent);
}

export { Element, appendChild };