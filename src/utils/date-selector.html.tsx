import { render } from 'nano-jsx';
import { getFormattedDate, addToDate, getShorthandedDayOfTheWeekName } from './date-utils.js';

type Props = {
  date: string,
  onDayChanged: (day: string) => void,
  children: HTMLElement[] | [HTMLElement]

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

  return (<div class="date-selector">
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
    {props.children}
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
  props: Props, children: HTMLElement[]) {
  render(<Element
    date={props.date}
    onDayChanged={props.onDayChanged}
    children={children}
  />, parent);
}

export { Element, appendChild };