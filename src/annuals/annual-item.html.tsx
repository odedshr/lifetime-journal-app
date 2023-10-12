import { render } from 'nano-jsx';
import { Annual } from '../types.js';
import { isFirstDateBeforeSecondDate, getMmDdFromString } from '../utils/date-utils.js';

type Props = {
  data: Annual;
  date: string;
  onEditRequest?: () => void;
};

type ElementType = (props: Props) => HTMLElement;

const Element: ElementType = (props) => {
  const { label, startYear, color, endYear } = props.data;
  const onClick = (evt: MouseEvent) => {
    evt.preventDefault();
    props.onEditRequest && props.onEditRequest();
    return false;
  };
  const now = new Date(props.date);
  const classes = ["annual-item"];
  if (isFirstDateBeforeSecondDate(now, new Date(`${startYear}-${getMmDdFromString(props.date)}`))) {
    classes.push("future-event");
  }
  if (endYear && isFirstDateBeforeSecondDate(new Date(`${endYear}-${getMmDdFromString(props.date)}`), now)) {
    classes.push("past-event");
  }

  return <li class={classes.join(" ")}>
    <span class="annual-label">{label}</span>
    <span class="annual-start">{startYear}</span>
    <span class="annual-end">{endYear}</span>
    {props.onEditRequest ? <a href="/annuals/" title="Edit annual entry" class="annual-edit" onClick={onClick}><span>Edit</span></a> : null}
  </li>;
};

function appendChild(parent: HTMLElement, data: Annual, date: string, onEditRequest?: () => void) {
  render(<Element data={data} date={date} onEditRequest={onEditRequest} />, parent);
}

export { Element, appendChild };