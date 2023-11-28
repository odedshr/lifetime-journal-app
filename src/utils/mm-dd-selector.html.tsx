import { render } from 'nano-jsx';
import { MONTH_NAMES, LEAP_YEAR_MONTH_LENGTH, getFormattedDate } from './date-utils.js';
import { Element as DateSelector } from './date-selector.html.js';
import { ElementType } from '../types.js';

type Props = {
  date: string,
  onDayChanged: (day: string) => void
}

const Element: ElementType<Props> = (props) => {
  let monthSelector: HTMLSelectElement;
  let daySelector: HTMLSelectElement;
  const date = new Date(props.date);
  const month = date.getMonth();
  const day = date.getDate();
  const days = Array(LEAP_YEAR_MONTH_LENGTH[month]).fill(0).map((_, i) => (i + 1));

  const onMonthChanged = () => {
    date.setMonth(+monthSelector.value);
    props.onDayChanged(getFormattedDate(date));
  }
  const onDayChanged = () => {
    date.setDate(+daySelector.value);
    props.onDayChanged(getFormattedDate(date));
  }

  return <DateSelector date={props.date} onDayChanged={props.onDayChanged}>
    <select class="month-selector" title="Select Month"
      ref={(el: HTMLSelectElement) => monthSelector = el}
      onChange={onMonthChanged}>
      {MONTH_NAMES.map((name, i) => (i === month) ? <option value={month} selected>{name}</option> : <option value={i}>{name}</option>)}
    </select>
    <select class="day-selector" title="Select Day"
      ref={(el: HTMLSelectElement) => daySelector = el}
      onChange={onDayChanged}>
      {days.map((v) => (v === day) ? <option value={v} selected>{v}</option> : <option value={v}>{v}</option>)}
    </select>
  </DateSelector>;
};

function appendChild(parent: HTMLElement,
  props: Props) {
  render(<Element
    date={props.date}
    onDayChanged={props.onDayChanged}
  />, parent);
}

export { Element, appendChild };