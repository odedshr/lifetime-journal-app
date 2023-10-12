import { render } from 'nano-jsx';
import { Element as DaySelector } from '../utils/yyyy-mm-dd-selector.html.js';
import { Element as TextField } from './text-field.html.js';
import { Element as EmojiField } from './emoji-field.html.js';
import { Element as NumberField } from './number-field.html.js';
import { Element as ColorField } from './color-field.html.js';
import { Element as Annuals } from '../annuals/annual-list.html.js';
import { Entry, Field, Annual } from '../types.js';

type ElementType = (props: {
  date: string,
  entry: Entry,
  annuals: Annual[],
  leapYearAnnuals: Annual[]
  onDayChanged: (day: string) => void,
  onEntryChanged: (entry: Entry) => Promise<boolean>,
  onAnnualEditRequest: (id?: number) => void,
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
    const result = await props.onEntryChanged(props.entry);

    if (result) {
      targetField.value = originalValue;
    }

    return result;
  };

  return (<main class="entry">
    <header>
      <DaySelector date={props.date} onDayChanged={props.onDayChanged} />
    </header>
    <section id="recurring">
      <Annuals date={props.date}
        items={props.annuals}
        readonly={props.leapYearAnnuals}
        onEditRequest={props.onAnnualEditRequest} />
    </section>
    <section id="entry" class="entry-fields">
      {props.entry.fields.map(field => {
        const fieldElement = getFieldElement(field, onValueChanged);
        fieldElementMap.set(field, fieldElement);
        return fieldElement;
      })}
    </section>
    <section id="periods"></section>
    <section id="diaries"></section>
    <footer>
      <a href="#" onClick={() => props.onAnnualEditRequest()}><span>Add Annual</span></a>
    </footer>
  </main>);
}

function appendChild(parent: HTMLElement,
  dateString: string,
  entry: Entry,
  annuals: Annual[],
  leapYear: Annual[],
  onDayChanged: (day: string) => void,
  onEntryChanged: (entry: Entry) => Promise<boolean>,
  onAnnualEditRequest: (id?: number) => void) {

  const element = <Element
    date={dateString}
    entry={entry}
    annuals={annuals}
    leapYearAnnuals={leapYear}
    onDayChanged={onDayChanged}
    onEntryChanged={onEntryChanged}
    onAnnualEditRequest={onAnnualEditRequest}
  />
  render(element, parent);
}

function getFieldElement(field: Field<any>, onValueChanged: (field: Field<any>, value: any) => Promise<boolean>) {
  switch (field.type) {
    case 'text':
      return <TextField field={field} onValueChanged={onValueChanged} />;
    case 'emoji':
      return <EmojiField field={field} onValueChanged={onValueChanged} />;
    case 'number':
      return <NumberField field={field} onValueChanged={onValueChanged} />;
    case 'color':
      return <ColorField field={field} onValueChanged={onValueChanged} />;
    default:
      return <p>Unknown field type: {field.type}</p>
  }
}

export { appendChild };