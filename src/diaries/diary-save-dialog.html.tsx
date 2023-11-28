import { render } from 'nano-jsx';
import { Diary, ElementType, FieldTemplate } from '../types.js';

type ShowModalDelegate = (diary: Diary) => void;

type Props = {
  onDelegatorProvided: (delegate: ShowModalDelegate) => void,
  onSaveRequest: (diary: Diary) => Promise<Error[]>,
};

const Element: ElementType<Props> = (props: Props) => {
  let dialog: HTMLDialogElement;
  let form: HTMLFormElement;
  let defaultFields: FieldTemplate[];

  const showModal = (diary: Diary) => {
    (dialog.querySelector('#diary-name') as HTMLInputElement).value = diary.name;
    (dialog.querySelector('#diary-uri') as HTMLInputElement).value = diary.uri;
    (dialog.querySelector('#diary-color') as HTMLInputElement).value = diary.color;
    (dialog.querySelector('#diary-startDate') as HTMLInputElement).value = diary.startDate;
    defaultFields = diary.defaultFields;
    dialog.showModal();
  }

  props.onDelegatorProvided(showModal);

  async function onSave(evt: SubmitEvent) {
    const formData = new FormData(form);
    if ((formData.get("action") as string) === "save") {
      if (form.reportValidity()) {
        const errors = await props.onSaveRequest({
          name: formData.get("name") as string,
          uri: formData.get("uri") as string,
          startDate: formData.get("startDate") as string,
          color: formData.get("color") as string,
          defaultFields
        });
        if (errors.length) {
          console.log("errors:", errors);
          evt.preventDefault();
          return false;
        }
      }
    }
  }

  return (<dialog ref={(el: HTMLDialogElement) => dialog = el}>
    <form method="dialog" ref={(el: HTMLFormElement) => form = el}>
      <div>
        <label for="diary-name">Name</label>
        <input type="text" id="diary-name" name="name" required />
      </div>
      <div>
        <label for="diary-uri">URI</label>
        <input type="text" id="diary-uri" name="uri" required />
      </div>
      <div>
        <label for="diary-name">Start Date</label>
        <input type="date" id="diary-startDate" name="startDate" />
      </div>
      <div>
        <label for="diary-color">Color</label>
        <input type="color" id="diary-color" name="color" />
      </div>
      <div>
        <button type="submit" value="save" name="action" onClick={onSave}>Save</button>
        <button value="cancel" name="action">Cancel</button>
      </div>
    </form>
  </dialog>);
}

export { Element, ShowModalDelegate };