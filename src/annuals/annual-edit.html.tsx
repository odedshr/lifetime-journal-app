import { render } from 'nano-jsx';
import { Annual } from '../types.js';

type Props = {
  data: Annual
  onChanged: (annual: Annual) => Promise<boolean>;
  onCancel?: () => void;
  onDelete?: () => Promise<boolean>;
};
type ElementType = (props: Props) => HTMLElement;

function saveForm(formData: FormData, props: Props) {
  let isDirty = false;
  if (formData.get('label') as string !== props.data.label) {
    props.data.label = formData.get('label') as string;
    isDirty = true;
  }
  if (+(formData.get('start') as string) !== props.data.startYear) {
    props.data.startYear = +(formData.get('start') as string);
    isDirty = true;
  }
  const endYear = +(formData.get('end') as string) || undefined;
  if (endYear !== props.data.endYear) {
    props.data.endYear = endYear;
    isDirty = true;
  }
  if (formData.get('color') !== props.data.color) {
    props.data.color = formData.get('color') as string;
    isDirty = true;
  }

  return isDirty ? props.onChanged(props.data) : true;
}

const Element: ElementType = (props) => {
  let form: HTMLFormElement;
  const { label, startYear, color, endYear } = props.data;
  const onExitPage = (action: 'save' | 'cancel' | 'delete', evt: MouseEvent) => {
    evt.preventDefault();
    switch (action) {
      case 'save':
        saveForm(new FormData(form), props);
        break;
      case 'cancel':
        props.onCancel && props.onCancel();
        break;
      case 'delete':
        props.onDelete && props.onDelete();
        break;
    }
    return false;
  };

  return <form
    class="annual-edit-form"
    ref={(el: HTMLFormElement) => form = el}
    onSubmit={onExitPage.bind({}, 'save')}>
    <div>
      <label for="annual-label">Label</label>
      <input type="text" id="annual-label" name="label" value={label} required />
    </div>
    <div>
      <label for="annual-startYear">Start year</label>
      <input type="number" step="1" id="annual-startYear" name="start" value={startYear} required />
    </div>
    <div>
      <label for="annual-endYear">End year</label>
      <input type="number" step="1" id="annual-endYear" name="end" value={endYear !== undefined ? endYear : ''} />
    </div>
    <div>
      <label for="annual-color">Color</label>
      <input type="color" id="annual-color" name="color" value={color} />
    </div>
    <footer class="actions">
      <button type="submit" class="btn-save"><span>Save</span></button>
      {props.onCancel ?
        <button type="reset" class="btn-cancel" onClick={onExitPage.bind({}, 'cancel')} ><span>Cancel</span></button> : null}
      {props.onDelete ?
        <button type="reset" class="btn-delete" onClick={onExitPage.bind({}, 'delete')} ><span>Delete</span></button> : null}
    </footer>
  </form>;
};

function appendChild(parent: HTMLElement,
  data: Annual,
  onChanged: (annual: Annual) => Promise<boolean>,
  onDelete: () => Promise<boolean>,
  onCancel: () => void) {
  render(<Element
    data={data}
    onChanged={onChanged}
    onDelete={onDelete}
    onCancel={onCancel} />, parent);
}

export { Element, appendChild };