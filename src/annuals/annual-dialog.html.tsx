import { render } from 'nano-jsx';
import { ElementType, Annual } from '../types.js';

type Props = {
  annual: Annual
  onChanged: (annual: Annual) => Promise<boolean>;
  onCancel?: () => void;
  onDelete?: () => Promise<boolean>;
};

function saveForm(formData: FormData, props: Props) {
  let isDirty = false;
  if (formData.get('label') as string !== props.annual.label) {
    props.annual.label = formData.get('label') as string;
    isDirty = true;
  }
  if (+(formData.get('start') as string) !== props.annual.startYear) {
    props.annual.startYear = +(formData.get('start') as string);
    isDirty = true;
  }
  const endYear = +(formData.get('end') as string) || undefined;
  if (endYear !== props.annual.endYear) {
    props.annual.endYear = endYear;
    isDirty = true;
  }
  if (formData.get('color') !== props.annual.color) {
    props.annual.color = formData.get('color') as string;
    isDirty = true;
  }

  return isDirty ? props.onChanged(props.annual) : true;
}

const Element: ElementType<Props, HTMLDialogElement> = (props) => {
  let form: HTMLFormElement;
  const { label, startYear, color, endYear } = props.annual;
  const onExitPage = (action: 'save' | 'cancel' | 'delete', evt: MouseEvent) => {
    evt.preventDefault();
    switch (action) {
      case 'save':
        saveForm(new FormData(form), props);
        break;
      case 'cancel':
        return props.onCancel && props.onCancel();
      case 'delete':
        return props.onDelete && props.onDelete();
    }
    return false;
  };

  return <dialog opened>
    <h2>Edit Annual Event</h2>
    <form
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
    </form></dialog>;
};

export { Element, Props };