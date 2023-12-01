import { render } from 'nano-jsx';
import { Element as PeriodItem } from './period-item.html.js';
import { Element as PeriodDialog, Props as PeriodDialogProps } from '../periods/period-dialog.html.js';
import { Period } from '../types.js';

type ElementType = (props: {
  date: Date;
  items: Period[];
  onSetPeriod: (period: Period | null, id?: string) => Promise<Period[] | Error>,
  onSetDelegate: (method: (period?: Period) => void) => void

}) => HTMLElement;

const Element: ElementType = (props) => {
  let section: HTMLElement;
  let list: HTMLUListElement;

  const getListItems = (periods: Period[]) => periods.map(
    (item) => <PeriodItem date={props.date} data={item} onEditRequest={() => onPeriodEditRequest(item)} />
  );

  const refreshList = (periods: Period[]) => {
    while (list.children.length) { list.removeChild(list.children[0]); }
    render(getListItems(periods), list);
  };

  const onPeriodEditRequest = (period?: Period) => {
    if (period === undefined) {
      period = { id: undefined, label: '', startDate: props.date }
    }

    let dialog: HTMLDialogElement;
    const removedDialog = () => section.removeChild(dialog);
    const updatePeriod = async (period: Period | null, id?: string) => {
      const periods = await props.onSetPeriod(period, id);
      if (Array.isArray(periods)) {
        refreshList(periods);
        removedDialog();
      }
      return periods;
    }
    const periodDialogProps: PeriodDialogProps = {
      period,
      onChanged: async (period: Period) => updatePeriod(period, period.id),
      onCancel: removedDialog,
    };
    if (period.id !== undefined) {
      periodDialogProps.onDelete = async () => updatePeriod(null, (period as Period).id);
    }
    dialog = PeriodDialog(periodDialogProps);
    section.appendChild(dialog);
    dialog.showModal();
  }
  props.onSetDelegate(onPeriodEditRequest);

  return (
    <section class="periods" ref={(el: HTMLElement) => { section = el; }}>
      <ul ref={(el: HTMLUListElement) => { list = el; }}>
        {getListItems(props.items)}
      </ul>
    </section>
  )
};

export { Element };