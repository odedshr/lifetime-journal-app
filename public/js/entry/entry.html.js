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
import { Element as DaySelector } from './day-selector.html.js';
import { Element as TextField } from './text-field.html.js';
import { Element as EmojiField } from './emoji-field.html.js';
const Element = (props) => {
    const fieldElementMap = new Map();
    const onValueChanged = (field, value) => __awaiter(void 0, void 0, void 0, function* () {
        const targetField = props.entry.fields.find(f => (f === field));
        if (!targetField) {
            return false;
        }
        const originalValue = targetField.value;
        targetField.value = value;
        const result = yield props.onEntryChanged(props.entry);
        if (result) {
            targetField.value = originalValue;
        }
        return result;
    });
    return (_jsxs("main", { class: "entry", children: [_jsx("header", { children: _jsx(DaySelector, { date: props.date, onDayChanged: props.onDayChanged }) }), _jsx("section", { id: "recurring" }), _jsx("section", { id: "entry", children: props.entry.fields.map(field => {
                    const fieldElement = getFieldElement(field, onValueChanged);
                    fieldElementMap.set(field, fieldElement);
                    return fieldElement;
                }) }), _jsx("section", { id: "periods" }), _jsx("section", { id: "diaries" })] }));
};
function appendChild(parent, dateString, entry, onDayChanged, onEntryChanged, annuals) {
    const element = _jsx(Element, { date: dateString, entry: entry, annuals: annuals, onDayChanged: onDayChanged, onEntryChanged: onEntryChanged });
    render(element, parent);
}
function getFieldElement(field, onValueChanged) {
    switch (field.type) {
        case 'text':
            return _jsx(TextField, { field: field, onValueChanged: onValueChanged });
        case 'emoji':
            return _jsx(EmojiField, { field: field, onValueChanged: onValueChanged });
        default:
            return _jsxs("p", { children: ["Unknown field type: ", field.type] });
    }
}
export { appendChild };
