import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { parse as parseMarkdown } from 'marked';
const Element = (props) => {
    return (_jsx("ul", { id: props.id, class: "entry-view", children: props.entry.fields.map(field => field.value ? _jsxs("li", { class: "field-item", children: [_jsx("div", { class: "field-label", children: field.label }), getFieldElement(field)] }) : null) }));
};
function sanitizeHTML(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function getFieldElement(field) {
    switch (field.type) {
        case 'text':
            return _jsx("div", { class: "text-field-preview", innerHTML: { __dangerousHtml: parseMarkdown(sanitizeHTML(field.value || '')) } });
        case 'emoji':
            return _jsx("div", { class: "emoji-field-preview", children: field.value });
        case 'number':
            return _jsx("div", { class: "number-field-preview", "data-unit": field.unit, children: field.value });
        case 'color':
            const colorAttribute = { 'style': `background-color:${field.value}` };
            return _jsx("div", Object.assign({ class: "color-field-preview" }, colorAttribute));
        default:
            return _jsxs("p", { children: ["Unknown field type: ", field.type] });
    }
}
export { Element };
