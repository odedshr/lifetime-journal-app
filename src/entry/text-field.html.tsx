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
  const previewElement = document.getElementById('text-field-preview') as HTMLDivElement
  return previewElement;
}

function setPreviewElementContent(previewElement: HTMLDivElement, value: string, visible: boolean) {
  previewElement.setAttribute('data-preview', `${visible}`);
  previewElement.innerHTML = parseMarkdown(value);
}

function toggleEditOn(evt: MouseEvent, textarea: HTMLTextAreaElement) {
  evt.preventDefault();
  evt.stopPropagation();
  getPreviewElement().setAttribute('data-preview', 'false');
  textarea.focus();
  textarea.select();
  return false;
}

const Element: ElementType = (props) => {
  let previewElement: HTMLDivElement;
  let inputField: HTMLTextAreaElement

  let oldValue = props.field.value || '';

  const getPreviewModeStatus = (value: string) => value.trim().length > 0;

  const toggleEditOff = async (evt: InputEvent) => {
    const newValue: string = sanitizeHTML(inputField.value);
    if (newValue !== oldValue) {
      inputField.setAttribute('data-saving', 'true');
      if (await props.onValueChanged(props.field, newValue)) {
        oldValue = newValue;
      }
      inputField.value = oldValue;
      setPreviewElementContent(previewElement, oldValue, getPreviewModeStatus(oldValue));
      inputField.removeAttribute('data-saving');
    }
  };

  return (<div class="text-field">
    <label for="entry-text" class="entry-label">{props.field.label}</label>
    <div
      ref={(el: HTMLDivElement) => { previewElement = el; }}
      id="text-field-preview"
      class="text-field-preview"
      data-preview={getPreviewModeStatus(oldValue)}
      innerHTML={{ __dangerousHtml: parseMarkdown(sanitizeHTML(oldValue)) }}
      onClick={(evt: MouseEvent) => toggleEditOn(evt, inputField)}></div>
    <textarea id="entry-text" class="text-field"
      ref={(el: HTMLTextAreaElement) => { inputField = el; }}
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