import { render } from 'nano-jsx';
import { Period } from '../types.js';
import { getFormattedDate } from '../utils/date-utils.js';

type Props = {
  data: Period
  onChanged: (period: Period) => Promise<boolean>;
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
  const start = new Date(formData.get('start') as string)
  if (start.getDate() !== props.data.startDate.getDate()) {
    props.data.startDate = start;
    isDirty = true;
  }

  const endString = formData.get('end') as string || undefined;
  if (endString && endString.length) {
    const end = new Date(endString);
    if (!props.data.endDate || end.getDate() !== props.data.endDate.getDate()) {
      props.data.endDate = end;
      isDirty = true;
    }
  } else if (props.data.endDate !== undefined) {
    props.data.endDate = undefined;
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
  const { label, startDate, color, endDate } = props.data;
  const startDateString = startDate ? getFormattedDate(startDate) : '';
  const endDateString = endDate ? getFormattedDate(endDate) : '';

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
    class="period-edit-form"
    ref={(el: HTMLFormElement) => form = el}
    onSubmit={onExitPage.bind({}, 'save')}>
    <div>
      <label for="period-label">Label</label>
      <input type="text" id="period-label" name="label" value={label} required />
    </div>
    <div>
      <label for="period-start">Start year</label>
      <input type="date" id="period-start" name="start" value={startDateString} required />
    </div>
    <div>
      <label for="period-end">End year</label>
      <input type="date" id="period-end" name="end" value={endDateString} />
    </div>
    <div>
      <label for="period-color">Color</label>
      <input type="color" id="period-color" name="color" value={color} />
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

export { Element };