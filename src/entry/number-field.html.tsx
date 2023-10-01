import { render } from 'nano-jsx';
import { NumberField } from '../types.js';

type Props = {
  field: NumberField,
  onValueChanged: (field: NumberField, value: number) => Promise<boolean>
}
type ElementType = (props: Props) => HTMLElement;

const Element: ElementType = (props) => {
  let oldValue = props.field.value;

  const onBlur = async (evt: InputEvent) => {
    const inputField = evt.target as HTMLInputElement;
    const newValue: number = +inputField.value;
    if (newValue !== oldValue) {
      inputField.setAttribute('data-saving', 'true');
      const updateResult = await props.onValueChanged(props.field, newValue);
      if (!updateResult) {
        inputField.value = `${oldValue}`;
      }
      inputField.removeAttribute('data-saving');
    }
  };

  return (<div class="number-field">
    <label for="entry-number" class="entry-label">{props.field.label}</label>
    <input type="number" id="entry-number" class="number-field"
      name="entry-number"
      min={props.field.min || ''}
      max={props.field.max || ''}
      step={props.field.step || ''}
      onBlur={onBlur} value={props.field.value}
    />
    <span class="entry-unit">{props.field.unit}</span>
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