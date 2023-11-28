import { render } from 'nano-jsx';

import { ElementType, Period } from '../types.js';
import { Element as DaySelector } from '../utils/yyyy-mm-dd-selector.html.js';

import { Element as Periods } from './period-list.html.js';
import { Element as EditPeriod } from './period-edit.html.js';

type Props = {
  date: string,
  periods: Period[],
  id?: String,
  onDayChanged: (day: string) => void,
  onPeriodChanged: (period: Period) => Promise<boolean>,
  onExitPage: () => void,
  onPeriodEditRequest: (id: string) => void,
  onDeletePeriodRequested: (id: string) => Promise<boolean>
};

const EMPTY_PERIOD: Period = {
  id: undefined,
  label: '',
  startDate: new Date(),
};

async function onPeriodChanged(props: Props, period: Period) {
  if (await props.onPeriodChanged(period)) {
    props.onExitPage()
  }
  return false; // prevent default behavior of form submission
}

const Element: ElementType<Props> = (props) => {
  const date = new Date(props.date);
  const editedPeriod = props.id !== undefined ? props.periods.find(period => period.id === props.id) : undefined;

  return (<main class="periods">
    <header>
      <DaySelector date={props.date} onDayChanged={props.onDayChanged} />
    </header>

    {editedPeriod ?
      <EditPeriod
        data={editedPeriod}
        onChanged={onPeriodChanged.bind({}, props)}
        onCancel={props.onExitPage}
        onDelete={props.onDeletePeriodRequested.bind({}, props.id as string)} /> :
      <section>
        <Periods date={date}
          items={props.periods}
          onEditRequest={props.onPeriodEditRequest} />
        <EditPeriod
          data={EMPTY_PERIOD}
          onCancel={props.onExitPage}
          onChanged={onPeriodChanged.bind({}, props)} />
      </section>}
  </main>);
}

function appendChild(parent: HTMLElement,
  dateString: string,
  periods: Period[],
  onDayChanged: (day: string) => void,
  onPeriodChanged: (period: Period) => Promise<boolean>,
  onPeriodEditRequest: (id: string) => void,
  onDeletePeriodRequested: (id: string) => Promise<boolean>,
  onExitPage: () => void,
  id?: string) {
  const date = new Date(dateString);

  render(<Element
    date={dateString}
    periods={periods}
    onDayChanged={onDayChanged}
    onPeriodChanged={onPeriodChanged}
    onPeriodEditRequest={onPeriodEditRequest}
    onDeletePeriodRequested={onDeletePeriodRequested}
    onExitPage={onExitPage}
    id={id}
  />, parent);
}

export { appendChild };