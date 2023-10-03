var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { parse as parseMarkdown } from 'marked';
import { render } from 'nano-jsx';
function sanitizeHTML(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function getPreviewElement() {
    const previewElement = document.getElementById('text-field-preview');
    return previewElement;
}
function setPreviewElementContent(previewElement, value, visible) {
    previewElement.setAttribute('data-preview', `${visible}`);
    previewElement.innerHTML = parseMarkdown(value);
}
function toggleEditOn(evt, textarea) {
    evt.preventDefault();
    evt.stopPropagation();
    getPreviewElement().setAttribute('data-preview', 'false');
    textarea.focus();
    textarea.select();
    return false;
}
const Element = (props) => {
    let previewElement;
    let inputField;
    let oldValue = props.field.value || '';
    const getPreviewModeStatus = (value) => value.trim().length > 0;
    const toggleEditOff = (evt) => __awaiter(void 0, void 0, void 0, function* () {
        const newValue = sanitizeHTML(inputField.value);
        if (newValue !== oldValue) {
            inputField.setAttribute('data-saving', 'true');
            if (yield props.onValueChanged(props.field, newValue)) {
                oldValue = newValue;
            }
            inputField.value = oldValue;
            setPreviewElementContent(previewElement, oldValue, getPreviewModeStatus(oldValue));
            inputField.removeAttribute('data-saving');
        }
    });
    return (_jsxs("div", { class: "text-field", children: [_jsx("label", { for: "entry-text", class: "entry-label", children: props.field.label }), _jsx("div", { ref: (el) => { previewElement = el; }, id: "text-field-preview", class: "text-field-preview", "data-preview": getPreviewModeStatus(oldValue), innerHTML: { __dangerousHtml: parseMarkdown(sanitizeHTML(oldValue)) }, onClick: (evt) => toggleEditOn(evt, inputField) }), _jsx("textarea", { id: "entry-text", class: "text-field", ref: (el) => { inputField = el; }, name: "entry-text", rows: "10", cols: "50", onBlur: toggleEditOff, children: props.field.value ? props.field.value : '' })] }));
};
function appendChild(parent, props) {
    render(_jsx(Element, { field: props.field, onValueChanged: props.onValueChanged }), parent);
}
export { Element, appendChild };
