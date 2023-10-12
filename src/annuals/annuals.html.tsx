import { render } from 'nano-jsx';

import { Annual } from '../types.js';
import { Element as DaySelector } from '../utils/mm-dd-selector.html.js';

import { Element as Annuals } from './annual-list.html.js';
import { Element as EditAnnual } from './annual-edit.html.js';

type Props = {
  date: string,
  annuals: Annual[],
  leapYear: Annual[],
  id?: number,
  onDayChanged: (day: string) => void,
  onAnnualChanged: (annuals: Annual[]) => Promise<boolean>,
  onExitPage: () => void,
  onAnnualEditRequest: (id: number) => void,
  onDeleteAnnualRequested: (id: number) => Promise<boolean>
};
type ElementType = (props: Props) => HTMLElement;

const EMPTY_ANNUAL: Annual = {
  label: '',
  startYear: (new Date()).getFullYear(),
};

async function onAnnualChanged(props: Props, newEntry: Annual) {
  if (props.id === undefined) {
    props.annuals.push(newEntry)
  } else {
    props.annuals[props.id] = newEntry;
  }
  if (await props.onAnnualChanged(props.annuals)) {
    props.onExitPage()
  }
  return false; // prevent default behavior of form submission
}
const Element: ElementType = (props) => (<main class="annuals">
  <header>
    <DaySelector date={props.date} onDayChanged={props.onDayChanged} />
  </header>

  {(props.id !== undefined) ?
    <EditAnnual
      data={props.annuals[props.id]}
      onChanged={onAnnualChanged.bind({}, props)}
      onCancel={props.onExitPage}
      onDelete={props.onDeleteAnnualRequested.bind({}, props.id as number)} /> :
    <section>
      <Annuals date={props.date}
        items={props.annuals}
        readonly={props.leapYear}
        onEditRequest={props.onAnnualEditRequest} />
      <EditAnnual
        data={EMPTY_ANNUAL}
        onCancel={props.onExitPage}
        onChanged={onAnnualChanged.bind({}, props)} />
    </section>}
</main>)

function appendChild(parent: HTMLElement,
  dateString: string,
  annuals: Annual[],
  leapYear: Annual[],
  onDayChanged: (day: string) => void,
  onAnnualChanged: (annuals: Annual[]) => Promise<boolean>,
  onAnnualEditRequest: (id: number) => void,
  onDeleteAnnualRequested: (id: number) => Promise<boolean>,
  onExitPage: () => void,
  id?: number) {

  render(<Element
    date={dateString}
    annuals={annuals}
    leapYear={leapYear}
    onDayChanged={onDayChanged}
    onAnnualChanged={onAnnualChanged}
    onAnnualEditRequest={onAnnualEditRequest}
    onDeleteAnnualRequested={onDeleteAnnualRequested}
    onExitPage={onExitPage}
    id={id}
  />, parent);
}

export { appendChild };