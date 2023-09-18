import { render } from 'nano-jsx';
import { Diary, FieldTemplate } from '../types.js';

const DEFAULT_DIARY = 'diary-01';
const DEFAULT_COLOR = '#41a5f5';

const element: string = <form id="setup" action="/setup" method="post">
  <h1>Let's set up a new diary</h1>
  <label for="startDate">Start Date</label>
  <input type="date" name="startDate" id="startDate" />
  <button type="submit" id="submit"><span>Next</span></button>
</form>

function deploy(parent: HTMLElement, delegates: {
  onSaveDiary: ((diary: Diary) => void),
  onSignOut: (() => void)
}) {
  parent.replaceChildren(element);
  const form = element as unknown as HTMLFormElement;
  form.onsubmit = submit.bind(null, delegates.onSaveDiary);
}

function submit(onSaveDiary: ((diary: Diary) => void), evt: SubmitEvent) {
  const formData = new FormData(evt.target as HTMLFormElement);
  const defaultFieldTemplate: FieldTemplate = { type: 'text' };
  onSaveDiary({
    startDate: formData.get('startDate') as string,
    name: DEFAULT_DIARY,
    color: DEFAULT_COLOR,
    defaultFields: [defaultFieldTemplate]
  });
  evt.preventDefault();
  return false;
}

export { deploy };