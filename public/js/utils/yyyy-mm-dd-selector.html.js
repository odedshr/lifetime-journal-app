import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { render } from 'nano-jsx';
import { Element as DateSelector } from './date-selector.html.js';
const Element = (props) => (_jsx(DateSelector, { date: props.date, onDayChanged: props.onDayChanged, children: _jsxs("div", { class: "entry-date", children: [_jsx("label", { for: "entry-date-input", class: "entry-date-label", children: "Navigate to date:" }), _jsx("input", { type: "date", class: "entry-date-input", id: "entry-date-input", name: "entry-date", value: props.date, onChange: (evt) => props.onDayChanged(evt.target.value) })] }) }));
function appendChild(parent, props) {
    render(_jsx(Element, { date: props.date, onDayChanged: props.onDayChanged }), parent);
}
export { Element, appendChild };
