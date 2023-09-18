import { parse as parseMarkdown } from 'marked';
import { render } from 'nano-jsx';
import { Field } from '../types.js';
type Props = {
  field: Field<string>,
  onValueChanged: (field: Field<string>, value: string) => Promise<boolean>
}
type ElementType = (props: Props) => HTMLElement;

function sanitizeHTML(html: string) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getPreviewElement() {
  return document.getElementById('text-field-preview') as HTMLDivElement;
}

function setPreviewElementContent(previewElement: HTMLDivElement, value: string, visible: boolean) {
  previewElement.setAttribute('data-preview', `${visible}`);
  previewElement.innerHTML = parseMarkdown(value);
}

function toggleEditOn(evt: MouseEvent) {
  evt.preventDefault();
  evt.stopPropagation();
  getPreviewElement().setAttribute('data-preview', 'false');
  const textarea = document.getElementById('entry-text') as HTMLTextAreaElement;
  textarea.focus();
  textarea.select();
  return false;
}

const Element: ElementType = (props) => {
  const oldValue = props.field.value;

  const getPreviewModeStatus = (value: string) => value.trim().length > 0;

  const toggleEditOff = async (evt: InputEvent) => {
    const textarea = evt.target as HTMLTextAreaElement;
    const newValue: string = sanitizeHTML(textarea.value);
    textarea.setAttribute('data-saving', 'true');
    const value = (await props.onValueChanged(props.field, newValue)) ? newValue : oldValue;
    setPreviewElementContent(getPreviewElement(), value, getPreviewModeStatus(value))
    textarea.removeAttribute('data-saving');
  };

  return (<div class="text-field">
    <label for="entry-text">{props.field.label}</label>
    <div
      id="text-field-preview"
      class="text-field-preview"
      data-preview={getPreviewModeStatus(oldValue)}
      innerHTML={{ __dangerousHtml: parseMarkdown(sanitizeHTML(props.field.value)) }}
      onClick={toggleEditOn}></div>
    <textarea id="entry-text" class="text-field"
      name="entry-text" rows="10" cols="50"
      onBlur={toggleEditOff}
    >
      {props.field.value ? props.field.value : ''}
    </textarea>
  </div>)
};

function appendChild(parent: HTMLElement,
  props: Props) {
  render(<Element
    field={props.field}
    onValueChanged={props.onValueChanged}
  />, parent);
}

export { Element, appendChild };