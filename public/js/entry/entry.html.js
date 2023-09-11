import { jsx as _jsx, jsxs as _jsxs } from "https://unpkg.com/nano-jsx/esm/jsx-runtime/index.js";
import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
import { Element as DaySelector } from './day-selector.html.js';
import { Element as TextField } from './text-field.html.js';
const Element = (props) => {
    const onValueChanged = (field, value) => {
        props.entry.fields.forEach(f => { if (f === field) {
            f.value = value;
        } });
        props.onEntryChanged(props.entry);
    };
    return (_jsxs("main", { children: [_jsx("header", { children: _jsx(DaySelector, { date: props.date, onDayChanged: props.onDayChanged }) }), _jsx("section", { id: "recurring" }), _jsx("section", { id: "entry", children: props.entry.fields.map(field => {
                    switch (field.type) {
                        case "text":
                            return _jsx(TextField, { field: field, onValueChanged: onValueChanged });
                        default:
                            return _jsxs("p", { children: ["Unknown field type: ", field.type] });
                    }
                }) }), _jsx("section", { id: "periods" }), _jsx("section", { id: "diaries" })] }));
};
function appendChild(parent, dateString, entry, onDayChanged, onEntryChanged, annuals) {
    render(_jsx(Element, { date: dateString, entry: entry, annuals: annuals, onDayChanged: onDayChanged, onEntryChanged: onEntryChanged }), parent);
}
function deploy(parent, dateString, entry, delegates) {
    appendChild(parent, dateString, entry, (day) => delegates.onDateChanged(day), (entry) => delegates.onEntryChanged(entry), []);
}
export { deploy };
