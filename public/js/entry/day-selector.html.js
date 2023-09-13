import { jsx as _jsx, jsxs as _jsxs } from "https://unpkg.com/nano-jsx/esm/jsx-runtime/index.js";
import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
import { getFormattedDate, addToDate } from '../utils/date-utils.js';
const Element = (props) => (_jsxs("div", { class: "day-selector", children: [_jsx("button", { type: "button", id: "btnPrevious", onClick: () => props.onDayChanged(addToDate(props.date, -1)), children: _jsx("span", { children: "Previous" }) }), _jsx("button", { type: "button", id: "btnToday", onClick: () => props.onDayChanged(getFormattedDate(new Date())), children: _jsx("span", { children: "Today" }) }), _jsx("label", { for: "entry-date", children: "Navigate to date:" }), _jsx("input", { type: "date", id: "entry-date", name: "entry-date", value: props.date, onChange: (evt) => props.onDayChanged(evt.target.value) }), _jsx("button", { type: "button", id: "btnNext", onClick: () => props.onDayChanged(addToDate(props.date, +1)), children: _jsx("span", { children: "Next" }) })] }));
function appendChild(parent, props) {
    render(_jsx(Element, { date: props.date, onDayChanged: props.onDayChanged }), parent);
}
export { Element, appendChild };
