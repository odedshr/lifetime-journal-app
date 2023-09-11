import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
import { Element as DaySelector } from './day-selector.html.js';
import { Element as TextField } from './text-field.html.js';
import { Entry, Field, Annual } from '../types.js';

type ElementType = (props: {
  date: string,
  entry: Entry,
  onDayChanged: (day: string) => void,
  onEntryChanged: (entry: Entry) => void,
  annuals: Annual[]
}) => HTMLElement;

const Element: ElementType = (props) => {

  const onValueChanged = (field: Field<any>, value: string) => {
    props.entry.fields.forEach(f => { if (f === field) { f.value = value; } })
    props.onEntryChanged(props.entry);
  };

  return (<main>
    <header>
      <DaySelector date={props.date} onDayChanged={props.onDayChanged} />
    </header>
    <section id="recurring"></section>
    <section id="entry">
      {props.entry.fields.map(field => {
        switch (field.type) {
          case "text":
            return <TextField field={field} onValueChanged={onValueChanged} />
          default:
            return <p>Unknown field type: {field.type}</p>
        }
      })}
    </section>
    <section id="periods"></section>
    <section id="diaries"></section>
  </main>);
}

function appendChild(parent: HTMLElement,
  dateString: string,
  entry: Entry,
  onDayChanged: (day: string) => void,
  onEntryChanged: (entry: Entry) => void,
  annuals: Annual[]) {
  render(<Element
    date={dateString}
    entry={entry}
    annuals={annuals}
    onDayChanged={onDayChanged}
    onEntryChanged={onEntryChanged}
  />, parent);
}

function deploy(parent: HTMLElement, dateString: string, entry: Entry, delegates: {
  onEntryChanged: ((entry: Entry) => void),
  onDateChanged: ((date: string) => void)
  onSignOut: (() => void)
}) {
  appendChild(parent, dateString, entry,
    (day: string) => delegates.onDateChanged(day),
    (entry: Entry) => delegates.onEntryChanged(entry),
    [])
}

export { deploy };