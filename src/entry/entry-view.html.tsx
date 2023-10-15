import { render } from 'nano-jsx';
import { parse as parseMarkdown } from 'marked';
import { Entry, Field, NumberField } from '../types.js';

type ElementType = (props: {
  id: string;
  entry: Entry
}) => HTMLElement;

const Element: ElementType = (props) => {

  return (
    <ul id={props.id} class="entry-view">
      {props.entry.fields.map(field => field.value ? <li class="field-item">
        <div class="field-label">{field.label}</div>
        {getFieldElement(field)}
      </li> : null)}
    </ul>);
}

function sanitizeHTML(html: string) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getFieldElement(field: Field<any>) {
  switch (field.type) {
    case 'text':
      return <div
        class="text-field-preview"
        innerHTML={{ __dangerousHtml: parseMarkdown(sanitizeHTML(field.value || '')) }}
      ></div>;
    case 'emoji':
      return <div class="emoji-field-preview">{field.value}</div>;
    case 'number':
      return <div class="number-field-preview" data-unit={(field as NumberField).unit}>{field.value}</div>;
    case 'color':
      const colorAttribute = { 'style': `background-color:${field.value}` };
      return <div class="color-field-preview" {...colorAttribute}></div>;
    default:
      return <p>Unknown field type: {field.type}</p>
  }
}

export { Element };