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
function sanitizeHTML(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
const Element = (props) => {
    let field;
    let oldValue = props.field.value;
    const onBlur = (evt) => __awaiter(void 0, void 0, void 0, function* () {
        const value = sanitizeHTML(field.value);
        props.onValueChanged(Object.assign(Object.assign({}, props.field), { value }), value !== oldValue);
    });
    return (_jsxs("div", { class: "emoji-field", children: [_jsx("label", { for: "entry-emoji", class: "entry-label", children: props.field.label }), _jsx("input", { type: "text", id: "entry-emoji", class: "entry-input", name: "entry-emoji", "max-length": "1", ref: (el) => field = el, onBlur: onBlur, value: props.field.value })] }));
};
export { Element };
