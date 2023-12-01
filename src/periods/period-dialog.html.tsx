import { render } from 'nano-jsx';
import { ElementType, Period } from '../types.js';
import { getFormattedDate } from '../utils/date-utils.js';

type Props = {
  period: Period
  onChanged: (period: Period) => Promise<Period[] | Error>;
  onCancel?: () => void;
  onDelete?: () => Promise<Period[] | Error>;
};

function saveForm(formData: FormData, props: Props) {
  let isDirty = false;
  if (formData.get('label') as string !== props.period.label) {
    props.period.label = formData.get('label') as string;
    isDirty = true;
  }
  const start = new Date(formData.get('start') as string)
  if (start.getDate() !== props.period.startDate.getDate()) {
    props.period.startDate = start;
    isDirty = true;
  }

  const endString = formData.get('end') as string || undefined;
  if (endString && endString.length) {
    const end = new Date(endString);
    if (!props.period.endDate || end.getDate() !== props.period.endDate.getDate()) {
      props.period.endDate = end;
      isDirty = true;
    }
  } else if (props.period.endDate !== undefined) {
    props.period.endDate = undefined;
    isDirty = true;
  }

  if (formData.get('color') !== props.period.color) {
    props.period.color = formData.get('color') as string;
    isDirty = true;
  }

  return isDirty ? props.onChanged(props.period) : true;
}

const Element: ElementType<Props, HTMLDialogElement> = (props) => {
  let form: HTMLFormElement;
  const { label, startDate, color, endDate } = props.period;
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
        confirm(`Delete period "${props.period.label}"?`) && props.onDelete && props.onDelete();
        break;
    }
    return false;
  };

  return <dialog opened>
    <h2>Edit Period</h2>
    <form
      method="dialog"
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
    </form></dialog>;
};

export { Element, Props };