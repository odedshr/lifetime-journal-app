import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';

type Props = {
  date: string,
  onDayChanged: (day: string) => void
}
type ElementType = (props: Props) => HTMLElement;

function getFormattedDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function addToDate(dateString: string, days: number) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days)
  return getFormattedDate(date);
}

const Element: ElementType = (props) => (<div class="day-selector">
  <button type="button"
    id="btnPrevious"
    onClick={() => props.onDayChanged(addToDate(props.date, -1))}
  ><span>Previous</span></button>
  <button type="button"
    id="btnToday"
    onClick={() => props.onDayChanged(getFormattedDate(new Date()))}
  ><span>Today</span></button>
  <label for="entry-date">Navigate to date:</label>
  <input type="date"
    id="entry-date"
    name="entry-date"
    value={props.date}
    onChange={(evt: Event) => props.onDayChanged((evt.target as HTMLInputElement).value)} />
  <button type="button"
    id="btnNext"
    onClick={() => props.onDayChanged(addToDate(props.date, +1))}
  ><span>Next</span></button>
</div>);

function appendChild(parent: HTMLElement,
  props: Props) {
  render(<Element
    date={props.date}
    onDayChanged={props.onDayChanged}
  />, parent);
}

export { Element, appendChild };