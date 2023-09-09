import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
import { Diary } from '../types.js';


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
  onSaveDiary({
    startDate: formData.get("startDate") as string,
    name: "diary-01"
  });
  evt.preventDefault();
  return false;
}

export { deploy };