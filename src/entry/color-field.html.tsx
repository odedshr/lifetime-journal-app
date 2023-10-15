import { render } from 'nano-jsx';
import { Field } from '../types.js';

type Props = {
  field: Field<string>,
  onValueChanged: (field: Field<string>, isDirty: boolean) => void
}
type ElementType = (props: Props) => HTMLElement;

function sanitizeHTML(html: string) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const Element: ElementType = (props) => {
  let field: HTMLInputElement;
  let oldValue = props.field.value;

  const onBlur = async (evt: InputEvent) => {
    const value: string = sanitizeHTML(field.value);
    props.onValueChanged({ ...props.field, value }, value !== oldValue);
  };

  return (<div class="color-field">
    <label for="entry-color" class="entry-label">{props.field.label}</label>
    <input type="color" id="entry-color" class="color-field"
      name="entry-color" max-length="1"
      ref={(el: HTMLInputElement) => field = el}
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