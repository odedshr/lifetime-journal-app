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
import { Element as TextField } from './text-field.html.js';
import { Element as EmojiField } from './emoji-field.html.js';
import { Element as NumberField } from './number-field.html.js';
import { Element as ColorField } from './color-field.html.js';
const Element = (props) => {
    let form;
    let dirtyFieldCount = 0;
    const draft = Object.assign(Object.assign({}, props.entry), { fields: props.entry.fields.map(field => (Object.assign({}, field))) });
    const onValueChanged = (id, field, isDirty) => __awaiter(void 0, void 0, void 0, function* () {
        draft.fields[id] = field;
        if (isDirty) {
            dirtyFieldCount++;
        }
        else {
            dirtyFieldCount--;
        }
    });
    const onSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        if (dirtyFieldCount) {
            const result = yield props.onEntryChanged(draft);
            if (result) {
                dirtyFieldCount = 0;
            }
        }
        props.onExitPage();
        return false; // prevent default form submission behavior.
    });
    const onExitPage = () => {
        form.reset();
        props.onExitPage();
    };
    return (_jsxs("form", { id: "entry-edit", class: "entry-edit", ref: (el) => form = el, onSubmit: onSubmit, children: [props.entry.fields.map((field, i) => getFieldElement(field, onValueChanged.bind({}, i))), _jsxs("div", { class: "actions", children: [_jsx("button", { type: "submit", class: "btn-save", children: _jsx("span", { children: "Save" }) }), _jsx("button", { type: "reset", class: "btn-cancel", onClick: onExitPage, children: _jsx("span", { children: "Cancel" }) })] })] }));
};
function getFieldElement(field, onValueChanged) {
    switch (field.type) {
        case 'text':
            return _jsx(TextField, { field: field, onValueChanged: onValueChanged });
        case 'emoji':
            return _jsx(EmojiField, { field: field, onValueChanged: onValueChanged });
        case 'number':
            return _jsx(NumberField, { field: field, onValueChanged: onValueChanged });
        case 'color':
            return _jsx(ColorField, { field: field, onValueChanged: onValueChanged });
        default:
            return _jsxs("p", { children: ["Unknown field type: ", field.type] });
    }
}
export { Element };
