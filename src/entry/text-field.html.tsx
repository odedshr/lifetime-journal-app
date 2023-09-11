import { parse as parseMarkdown } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
import { Field } from '../types.js';
type Props = {
  field: Field<string>,
  onValueChanged: (field: Field<string>, value: string) => void
}
type ElementType = (props: Props) => HTMLElement;

function sanitizeHTML(html: string) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getPreviewElement() {
  return document.getElementById('text-field-preview') as HTMLDivElement;
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
  const getPreviewModeStatus = () => props.field.value.trim().length > 0 ? 'true' : 'false';

  const toggleEditOff = (evt: InputEvent) => {
    const value: string = sanitizeHTML((evt.target as HTMLTextAreaElement).value);
    getPreviewElement().setAttribute('data-preview', getPreviewModeStatus())
    getPreviewElement().innerHTML = parseMarkdown(value);
    props.onValueChanged(props.field, value);
  };

  return (<div class="text-field">
    <label for="entry-text">{props.field.label}</label>
    <div
      id="text-field-preview"
      class="text-field-preview"
      data-preview={getPreviewModeStatus()}
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