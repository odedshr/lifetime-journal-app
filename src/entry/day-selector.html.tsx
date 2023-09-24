import { render } from 'nano-jsx';
import { getFormattedDate, addToDate, getShorthandedDayOfTheWeekName } from '../utils/date-utils.js';

type Props = {
  date: string,
  onDayChanged: (day: string) => void
}

type ElementType = (props: Props) => HTMLElement;

function onLinkClicked(onDayChanged: (day: string) => void, targetDate: Date, evt: MouseEvent) {
  onDayChanged(getFormattedDate(targetDate));
  evt.preventDefault();
}

const Element: ElementType = (props) => {
  const date = new Date(props.date);
  const prevDate = addToDate(date, -1);
  const nextDate = addToDate(date, +1);
  const prevDayLink = `/entry/?day=${getFormattedDate(prevDate)}`;
  const todayLink = `/entry/?day=${getFormattedDate(new Date())}`;
  const nextDayLink = `/entry/?day=${getFormattedDate(nextDate)}`;

  return (<div class="day-selector">
    <a id="btnPrevious" class="btn"
      href={prevDayLink}
      rel="prev"
      title="previous day"
      onClick={onLinkClicked.bind({}, props.onDayChanged, prevDate)}>
      <span>{getShorthandedDayOfTheWeekName(prevDate)}</span>
    </a>
    <a id="btnToday" class="btn"
      href={todayLink}
      rel="today"
      title="Today"
      onClick={onLinkClicked.bind({}, props.onDayChanged, new Date())}>
      <span>Today</span>
    </a>
    <div class="entry-date">
      <label for="entry-date-input" class="entry-date-label">Navigate to date:</label>
      <input type="date"
        class="entry-date-input"
        id="entry-date-input"
        name="entry-date"
        value={props.date}
        onChange={(evt: Event) => props.onDayChanged((evt.target as HTMLInputElement).value)} />
    </div>
    <a id="btnNext" class="btn"
      href={nextDayLink}
      rel="today"
      title="Today"
      onClick={onLinkClicked.bind({}, props.onDayChanged, nextDate)}>
      <span>{getShorthandedDayOfTheWeekName(nextDate)}</span>
    </a>
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