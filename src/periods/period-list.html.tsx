import { render } from 'nano-jsx';
import { Element as PeriodItem } from './period-item.html.js';
import { Period } from '../types.js';

type ElementType = (props: {
  date: Date;
  items: Period[];
  onEditRequest: (id: string) => void;

}) => HTMLElement;

const Element: ElementType = (props) => (
  <ul class="periods">
    {props.items.map(
      (item) => <PeriodItem date={props.date} data={item}
        onEditRequest={() => props.onEditRequest(item.id as string)} />)}
  </ul>);

export { Element };