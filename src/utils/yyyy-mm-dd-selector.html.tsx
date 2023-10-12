import { render } from 'nano-jsx';
import { Element as DateSelector } from './date-selector.html.js';



type Props = {
  date: string,
  onDayChanged: (day: string) => void
}

type ElementType = (props: Props) => HTMLElement;

const Element: ElementType = (props) => (<DateSelector date={props.date} onDayChanged={props.onDayChanged}>
  <div class="entry-date">
    <label for="entry-date-input" class="entry-date-label">Navigate to date:</label>
    <input type="date"
      class="entry-date-input"
      id="entry-date-input"
      name="entry-date"
      value={props.date}
      onChange={(evt: Event) => props.onDayChanged((evt.target as HTMLInputElement).value)} />
  </div>
</DateSelector>);

function appendChild(parent: HTMLElement,
  props: Props) {
  render(<Element
    date={props.date}
    onDayChanged={props.onDayChanged}
  />, parent);
}

export { Element, appendChild };