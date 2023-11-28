import { render } from 'nano-jsx';
import { ElementType, NumberField } from '../types.js';

type Props = {
  field: NumberField,
  onValueChanged: (field: NumberField, isDirty: boolean) => void
}

const Element: ElementType<Props> = (props) => {
  const oldValue = props.field.value;
  let field: HTMLInputElement;

  const onBlur = async (evt: InputEvent) => {
    const value: number = +field.value;
    props.onValueChanged({ ...props.field, value }, value !== oldValue);
  };


  return (<div class="number-field">
    <label for="entry-number" class="entry-label">{props.field.label}</label>
    <input type="number" id="entry-number" class="number-field"
      name="entry-number"
      min={props.field.min || ''}
      max={props.field.max || ''}
      step={props.field.step || ''}
      ref={(el: HTMLInputElement) => field = el}
      onBlur={onBlur} value={props.field.value}
    />
    <div class="entry-unit">{props.field.unit}</div>
  </div>)
};

export { Element };