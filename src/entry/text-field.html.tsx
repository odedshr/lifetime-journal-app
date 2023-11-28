import { render } from 'nano-jsx';
import { ElementType, Field } from '../types.js';

type Props = {
  field: Field<string>,
  onValueChanged: (field: Field<string>, isDirty: boolean) => void
};

function sanitizeHTML(html: string) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const Element: ElementType<Props> = (props) => {
  let textArea: HTMLTextAreaElement;
  const oldValue = props.field.value;

  const onBlur = async (evt: InputEvent) => {
    const value: string = sanitizeHTML(textArea.value);
    props.onValueChanged({ ...props.field, value }, value !== oldValue);
  };

  return (<div class="text-field">
    <label for="entry-text" class="entry-label">{props.field.label}</label>
    <textarea id="entry-text" class="entry-input"
      name="entry-text" rows="10" cols="50"
      ref={(el: HTMLTextAreaElement) => textArea = el}
      onBlur={onBlur}
    >
      {props.field.value ? props.field.value : ''}
    </textarea>
  </div>);
};

export { Element };