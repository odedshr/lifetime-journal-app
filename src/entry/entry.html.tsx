import { render } from 'nano-jsx';
import { Element as DaySelector } from '../utils/yyyy-mm-dd-selector.html.js';
import { Element as Annuals } from '../annuals/annual-list.html.js';
import { Element as Periods } from '../periods/period-list.html.js';
import { Element as EntryView } from './entry-view.html.js';
import { Element as EntryEdit } from './entry-edit.html.js';
import { Entry, Annual, Period } from '../types.js';

type Props = {
  date: string,
  entry: Entry,
  annuals: Annual[],
  leapYearAnnuals: Annual[],
  periods: Period[],
  onDayChanged: (day: string) => void,
  onEntryChanged: (entry: Entry) => Promise<boolean>,
  onAnnualEditRequest: (id?: number) => void,
  onPeriodChanged: (period: Period | null, id?: string) => Promise<Period[] | Error>,
  isEditMode?: boolean;
};
type ElementType = (props: Props) => HTMLElement;

const Element: ElementType = (props) => {
  let articleElm: HTMLElement;
  let entryView: HTMLElement;

  const attr: { [key: string]: any } = {};
  if (props.isEditMode) {
    attr['edit-mode'] = true;
  }

  const toggleEdit = () => articleElm.toggleAttribute('edit-mode');
  const onEntryChanged = async (entry: Entry) => {
    const result = await props.onEntryChanged(entry);
    if (result) {
      render(<EntryView id="entry-view" entry={entry} />, entryView, true);
    }
    return result
  }

  let editPeriod: (period?: Period) => void;
  const periodDelegate = (method: (period?: Period) => void) => { editPeriod = method; }

  return (<main class="entry">
    <header>
      <DaySelector date={props.date} onDayChanged={props.onDayChanged} />
    </header>
    <article class="entry-details" {...attr} ref={(el: HTMLElement) => articleElm = el}>
      <Periods date={new Date(props.date)}
        items={props.periods}
        onSetPeriod={props.onPeriodChanged}
        onSetDelegate={periodDelegate} />
      <Annuals date={props.date}
        items={props.annuals}
        readonly={props.leapYearAnnuals}
        onEditRequest={props.onAnnualEditRequest} />
      <div class="entry-view-wrapper" ref={(el: HTMLElement) => { entryView = el }}>
        <EntryView id="entry-view" entry={props.entry} />
      </div>
      <EntryEdit entry={props.entry} onEntryChanged={onEntryChanged} onExitPage={toggleEdit} />
      <section id="diaries"></section>
    </article>
    <footer>
      <a href="#" class="btn" onClick={toggleEdit}><span>Edit</span></a>
      <a href="#" class="btn" onClick={() => props.onAnnualEditRequest()}><span>Add Annual</span></a>
      <a href="#" class="btn" onClick={() => editPeriod()}><span>Add Period</span></a>
    </footer>
  </main>);
}

function appendChild(parent: HTMLElement, props: Props) {

  const element = <Element
    date={props.date}
    entry={props.entry}
    annuals={props.annuals}
    leapYearAnnuals={props.leapYearAnnuals}
    periods={props.periods}
    isEditMode={props.isEditMode}
    onDayChanged={props.onDayChanged}
    onEntryChanged={props.onEntryChanged}
    onAnnualEditRequest={props.onAnnualEditRequest}
    onPeriodChanged={props.onPeriodChanged}
  />
  render(element, parent);
}

export { appendChild };