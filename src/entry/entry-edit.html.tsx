import { render } from 'nano-jsx';
import { Element as TextField } from './text-field.html.js';
import { Element as EmojiField } from './emoji-field.html.js';
import { Element as NumberField } from './number-field.html.js';
import { Element as ColorField } from './color-field.html.js';
import { Entry, Field } from '../types.js';

type ElementType = (props: {
  entry: Entry,
  onEntryChanged: (entry: Entry) => Promise<boolean>,
  onExitPage: () => void
}) => HTMLElement;

const Element: ElementType = (props) => {
  let form: HTMLFormElement;
  let dirtyFieldCount: number = 0;
  const draft: Entry = {
    ...props.entry,
    fields: props.entry.fields.map(field => ({ ...field }))
  };

  const onValueChanged = async (id: number, field: Field<any>, isDirty: boolean) => {
    draft.fields[id] = field;

    if (isDirty) {
      dirtyFieldCount++;
    } else {
      dirtyFieldCount--;
    }
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();

    if (dirtyFieldCount) {
      const result = await props.onEntryChanged(draft);

      if (result) {
        dirtyFieldCount = 0;
      }
    }

    props.onExitPage();
    return false; // prevent default form submission behavior.
  }

  const onExitPage = () => {
    form.reset();
    props.onExitPage();
  };

  return (
    <form id="entry-edit"
      class="entry-edit"
      ref={(el: HTMLFormElement) => form = el}
      onSubmit={onSubmit}>
      {props.entry.fields.map((field, i) => getFieldElement(field, onValueChanged.bind({}, i)))}
      <div class="actions">
        <button type="submit" class="btn-save"><span>Save</span></button>
        <button type="reset" class="btn-cancel" onClick={onExitPage}><span>Cancel</span></button>
      </div>
    </form>);
}

function getFieldElement(field: Field<any>, onValueChanged: (field: Field<any>, isDirty: boolean) => void) {
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

export { Element };