import { render } from 'nano-jsx';
import { getFormattedDate, addToDate, getShorthandedDayOfTheWeekName } from '../utils/date-utils.js';

type Props = {
  date: string,
  onDayChanged: (day: string) => void
}

type ElementType = (props: Props) => HTMLElement;

const Element: ElementType = (props) => {
  const date = new Date(props.date);
  const dayBeforeDate = addToDate(date, -1);
  const dayAfterDate = addToDate(date, +1);

  return (<div class="day-selector">
    <button type="button"
      id="btnPrevious"
      onClick={() => props.onDayChanged(getFormattedDate(dayBeforeDate))}
    ><span>{getShorthandedDayOfTheWeekName(dayBeforeDate)}</span></button>
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
      onClick={() => props.onDayChanged(getFormattedDate(dayAfterDate))}
    ><span>{getShorthandedDayOfTheWeekName(dayAfterDate)}</span></button>
  </div>)
};

function appendChild(parent: HTMLElement,
  props: Props) {
  render(<Element
    date={props.date}
    onDayChanged={props.onDayChanged}
  />, parent);
}

export { Element, appendChild };