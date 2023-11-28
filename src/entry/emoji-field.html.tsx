import { render } from 'nano-jsx';
import { Field, ElementType } from '../types.js';

type Props = {
  field: Field<string>,
  onValueChanged: (field: Field<string>, isDirty: boolean) => void
}

function sanitizeHTML(html: string) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const Element: ElementType<Props> = (props) => {
  let field: HTMLInputElement;
  let oldValue = props.field.value;

  const onBlur = async (evt: InputEvent) => {
    const value: string = sanitizeHTML(field.value);
    props.onValueChanged({ ...props.field, value }, value !== oldValue);
  };

  return (<div class="emoji-field">
    <label for="entry-emoji" class="entry-label">{props.field.label}</label>
    <input type="text" id="entry-emoji" class="entry-input"
      name="entry-emoji" max-length="1"
      ref={(el: HTMLInputElement) => field = el}
      onBlur={onBlur}
      value={props.field.value}
    />
  </div>)
};

export { Element };