import { render } from 'nano-jsx';
import { Period } from '../types.js';
import { isSameDate } from '../utils/date-utils.js';

type Props = {
  data: Period;
  date: Date;
  onEditRequest?: () => void;
};

type ElementType = (props: Props) => HTMLElement;

const Element: ElementType = (props) => {
  const { label, startDate, endDate } = props.data;
  const onClick = (evt: MouseEvent) => {
    evt.preventDefault();
    props.onEditRequest && props.onEditRequest();
    return false;
  };

  const classes = ["period-item"];

  if (isSameDate(props.date, startDate)) {
    classes.push("period-start");
  }
  if (endDate && isSameDate(props.date, endDate)) {
    classes.push("period-end");
  }

  return <li class={classes.join(" ")}>
    <span class="period-label">{label}</span>
    {props.onEditRequest ? <a href="/periods/" title="Edit period entry" class="period-edit" onClick={onClick}><span>Edit</span></a> : null}
  </li>;
};

function appendChild(parent: HTMLElement, data: Period, date: Date, onEditRequest?: () => void) {
  render(<Element data={data} date={date} onEditRequest={onEditRequest} />, parent);
}

export { Element, appendChild };