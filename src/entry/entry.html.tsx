import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
import { Element as DaySelector } from './day-selector.html.js';
import { Element as TextField } from './text-field.html.js';
import { Entry, Field, Annual } from '../types.js';

type ElementType = (props: {
  date: string,
  entry: Entry,
  onDayChanged: (day: string) => void,
  onEntryChanged: (entry: Entry) => Promise<boolean>,
  annuals: Annual[]
}) => HTMLElement;

const Element: ElementType = (props) => {
  const fieldElementMap = new Map<Field<any>, HTMLElement>();

  const onValueChanged = async (field: Field<any>, value: string) => {
    const targetField = props.entry.fields.find(f => (f === field));
    if (!targetField) {
      return false;
    }
    const originalValue = targetField.value;
    targetField.value = value;
    const result = await props.onEntryChanged(props.entry)

    if (result) {
      targetField.value = originalValue;
    }

    return result;
  };

  return (<main>
    <header>
      <DaySelector date={props.date} onDayChanged={props.onDayChanged} />
    </header>
    <section id="recurring"></section>
    <section id="entry">
      {props.entry.fields.map(field => {
        const fieldElement = getFieldElement(field, onValueChanged);
        fieldElementMap.set(field, fieldElement);
        return fieldElement;
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
  onEntryChanged: (entry: Entry) => Promise<boolean>,
  annuals: Annual[]) {
  render(<Element
    date={dateString}
    entry={entry}
    annuals={annuals}
    onDayChanged={onDayChanged}
    onEntryChanged={onEntryChanged}
  />, parent);
}

function getFieldElement(field: Field<any>, onValueChanged: (field: Field<any>, value: string) => Promise<boolean>) {
  switch (field.type) {
    case "text":
      return <TextField field={field} onValueChanged={onValueChanged} />
    default:
      return <p>Unknown field type: {field.type}</p>
  }
}

function deploy(parent: HTMLElement, dateString: string, entry: Entry, delegates: {
  onEntryChanged: ((entry: Entry) => Promise<boolean>),
  onDateChanged: ((date: string) => void)
  onSignOut: (() => void)
}) {
  appendChild(parent, dateString, entry,
    (day: string) => delegates.onDateChanged(day),
    (entry: Entry) => delegates.onEntryChanged(entry),
    [])
}

export { deploy };