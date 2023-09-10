import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
import { Element as Annuals } from './annuals.html.js';
import { Entry, Annual } from '../types.js';

type ElementType = (props: {
  date: string,
  entry: Entry,
  onBtnPrevClicked: () => void,
  onBtnTodayClicked: () => void,
  onBtnNextClicked: () => void,
  onSetDayChanged: (event: Event) => void,
  onEntryChanged: (event: Event) => void,
  annuals: Annual[]
}) => HTMLElement;

const Element: ElementType = (props) => (<main>
  <header>
    <button id="btnPrevious" onClick={props.onBtnPrevClicked}><span>Previous</span></button>
    <button id="btnToday" onClick={props.onBtnTodayClicked}><span>Today</span></button>
    <label for="entry-date">Navigate to date:</label>
    <input type="date" id="entry-date" name="entry-date" value={props.date} onChange={props.onSetDayChanged} />
    <button id="btnNext" onClick={props.onBtnNextClicked}><span>Next</span></button>
  </header>
  <section id="recurring"></section>
  <section id="entry">
    <label for="entry-text">Entry:</label>
    <textarea id="entry-text" name="entry-text" rows="10" cols="50" onChange={props.onEntryChanged}>
      {props.entry ? props.entry.fields[0].value : ''}
    </textarea>
  </section>
  <section id="periods"></section>
  <section id="diaries"></section>
</main>)

function appendChild(parent: HTMLElement,
  dateString: string,
  entry: Entry,
  onBtnPrevClicked: () => void,
  onBtnTodayClicked: () => void,
  onBtnNextClicked: () => void,
  onSetDayChanged: (event: Event) => void,
  onEntryChanged: (event: Event) => void,
  annuals: Annual[]) {
  render(<Element
    date={dateString}
    entry={entry}
    annuals={annuals}
    onBtnPrevClicked={onBtnPrevClicked}
    onBtnTodayClicked={onBtnTodayClicked}
    onBtnNextClicked={onBtnNextClicked}
    onSetDayChanged={onSetDayChanged}
    onEntryChanged={onEntryChanged}
  />, parent);
}

function getFormattedDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function addToDate(dateString: string, days: number) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days)
  return getFormattedDate(date);
}

function getDisplayableDate(date: Date) {
  return date.toLocaleDateString(navigator.language);
}

function deploy(parent: HTMLElement, dateString: string, entry: Entry, delegates: {
  onEntryChanged: ((entry: Entry) => void),
  onDateChanged: ((date: string) => void)
  onSignOut: (() => void)
}) {
  document.title = `${getDisplayableDate(new Date(dateString))} | Lifetime Journal`;

  appendChild(parent, dateString, entry,
    () => delegates.onDateChanged(addToDate(dateString, -1)),
    () => delegates.onDateChanged(getFormattedDate(new Date())),
    () => delegates.onDateChanged(addToDate(dateString, +1)),
    (evt: Event) => delegates.onDateChanged((evt.target as HTMLInputElement).value),
    (evt: Event) => delegates.onEntryChanged({
      date: dateString,
      fields: [{ type: "text", value: (evt.target as HTMLTextAreaElement).value }]
    }),
    [])
}

export { deploy };