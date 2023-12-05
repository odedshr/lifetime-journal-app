import { render } from 'nano-jsx';
import { Element as AnnualItem } from './annual-item.html.js';
import { Element as AnnualDialog, Props as AnnualDialogProps } from './annual-dialog.html.js';
import { Annual } from '../types.js';

type ElementType = (props: {
  date: string;
  items: Annual[];
  readonly: Annual[];
  onSetAnnuals: (annual: Annual | null, id?: number) => Promise<Annual[] | Error>,
  onSetDelegate: (method: (id?: number) => void) => void

}) => HTMLElement;

const Element: ElementType = (props) => {
  let section: HTMLElement;
  let list: HTMLUListElement;
  let annuals = props.items;

  const getListItems = (annuals: Annual[]) => annuals.map(
    (item, id) => <AnnualItem date={props.date} data={item} onEditRequest={() => onAnnualEditRequest(id)} />
  );

  const refreshList = (annuals: Annual[]) => {
    while (list.children.length) { list.removeChild(list.children[0]); }
    render(getListItems(annuals), list);
  };

  const onAnnualEditRequest = (id?: number) => {
    const annual = id === undefined ? { label: '', startYear: (new Date()).getFullYear() } : annuals[id];

    let dialog: HTMLDialogElement;
    const removedDialog = () => section.removeChild(dialog);
    const updateAnnual = async (annuals: Annual[], updated: Annual | null, id?: number) => {
      const result = await props.onSetAnnuals(updated, id);
      if (Array.isArray(result)) {
        annuals = result;
        refreshList(annuals);
        removedDialog();
      }
      return annuals;
    }

    const annualDialogProps: AnnualDialogProps = {
      annual,
      onChanged: async (annual: Annual) => !!(await updateAnnual(annuals, annual, id)),
      onCancel: removedDialog,
    };
    if (id !== undefined) {
      annualDialogProps.onDelete = async () => !!updateAnnual(annuals, null, id);
    }
    dialog = AnnualDialog(annualDialogProps);
    section.appendChild(dialog);
    dialog.showModal();
  }
  props.onSetDelegate(onAnnualEditRequest);

  return (
    <section class="annuals" ref={(el: HTMLElement) => { section = el; }}>
      <ul ref={(el: HTMLUListElement) => { list = el; }}>
        {getListItems(props.items)}
        {getListItems(props.readonly)}
      </ul>
    </section>
  );
};

export { Element };