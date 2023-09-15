import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
import { Field } from '../types.js';

type Props = {
  field: Field<string>,
  onValueChanged: (field: Field<string>, value: string) => Promise<boolean>
}
type ElementType = (props: Props) => HTMLElement;

function sanitizeHTML(html: string) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const Element: ElementType = (props) => {
  let oldValue = props.field.value;

  const onBlur = async (evt: InputEvent) => {
    const inputField = evt.target as HTMLInputElement;
    const newValue: string = sanitizeHTML(inputField.value);
    if (newValue !== oldValue) {
      inputField.setAttribute('data-saving', 'true');
      if (!(await props.onValueChanged(props.field, newValue))) {
        inputField.value = oldValue;
      }
      inputField.removeAttribute('data-saving');

    }
  };

  return (<div class="emoji-field">
    <label for="entry-emoji">{props.field.label}</label>
    <input type="text" id="entry-emoji" class="emoji-field"
      name="entry-emoji" max-length="1"
      onBlur={onBlur} value={props.field.value}
    />
  </div>)
};

function appendChild(parent: HTMLElement,
  props: Props) {
  render(<Element
    field={props.field}
    onValueChanged={props.onValueChanged}
  />, parent);
}

export { Element, appendChild };