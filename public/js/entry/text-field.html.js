import { jsx as _jsx, jsxs as _jsxs } from "https://unpkg.com/nano-jsx/esm/jsx-runtime/index.js";
import { parse as parseMarkdown } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
function sanitizeHTML(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function getPreviewElement() {
    return document.getElementById('text-field-preview');
}
function toggleEditOn(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    getPreviewElement().setAttribute('data-preview', 'false');
    const textarea = document.getElementById('entry-text');
    textarea.focus();
    textarea.select();
    return false;
}
const Element = (props) => {
    const getPreviewModeStatus = () => props.field.value.trim().length > 0 ? 'true' : 'false';
    const toggleEditOff = (evt) => {
        const value = sanitizeHTML(evt.target.value);
        getPreviewElement().setAttribute('data-preview', getPreviewModeStatus());
        getPreviewElement().innerHTML = parseMarkdown(value);
        props.onValueChanged(props.field, value);
    };
    return (_jsxs("div", { class: "text-field", children: [_jsx("label", { for: "entry-text", children: props.field.label }), _jsx("div", { id: "text-field-preview", class: "text-field-preview", "data-preview": getPreviewModeStatus(), innerHTML: { __dangerousHtml: parseMarkdown(sanitizeHTML(props.field.value)) }, onClick: toggleEditOn }), _jsx("textarea", { id: "entry-text", class: "text-field", name: "entry-text", rows: "10", cols: "50", onBlur: toggleEditOff, children: props.field.value ? props.field.value : '' })] }));
};
function appendChild(parent, props) {
    render(_jsx(Element, { field: props.field, onValueChanged: props.onValueChanged }), parent);
}
export { Element, appendChild };
