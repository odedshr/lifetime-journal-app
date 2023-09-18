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
import { render } from 'nano-jsx';
function sanitizeHTML(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
const Element = (props) => {
    let oldValue = props.field.value;
    const onBlur = (evt) => __awaiter(void 0, void 0, void 0, function* () {
        const inputField = evt.target;
        const newValue = sanitizeHTML(inputField.value);
        if (newValue !== oldValue) {
            inputField.setAttribute('data-saving', 'true');
            const updateResult = yield props.onValueChanged(props.field, newValue);
            if (!updateResult) {
                inputField.value = oldValue;
            }
            inputField.removeAttribute('data-saving');
        }
    });
    return (_jsxs("div", { class: "emoji-field", children: [_jsx("label", { for: "entry-emoji", children: props.field.label }), _jsx("input", { type: "text", id: "entry-emoji", class: "emoji-field", name: "entry-emoji", "max-length": "1", onBlur: onBlur, value: props.field.value })] }));
};
function appendChild(parent, props) {
    render(_jsx(Element, { field: props.field, onValueChanged: props.onValueChanged }), parent);
}
export { Element, appendChild };
