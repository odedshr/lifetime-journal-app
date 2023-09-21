import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { render } from 'nano-jsx';
import { getFormattedDate, addToDate, getShorthandedDayOfTheWeekName } from '../utils/date-utils.js';
const Element = (props) => {
    const date = new Date(props.date);
    const dayBeforeDate = addToDate(date, -1);
    const dayAfterDate = addToDate(date, +1);
    return (_jsxs("div", { class: "day-selector", children: [_jsx("button", { type: "button", id: "btnPrevious", onClick: () => props.onDayChanged(getFormattedDate(dayBeforeDate)), children: _jsx("span", { children: getShorthandedDayOfTheWeekName(dayBeforeDate) }) }), _jsx("button", { type: "button", id: "btnToday", onClick: () => props.onDayChanged(getFormattedDate(new Date())), children: _jsx("span", { children: "Today" }) }), _jsx("label", { for: "entry-date", children: "Navigate to date:" }), _jsx("input", { type: "date", id: "entry-date", name: "entry-date", value: props.date, onChange: (evt) => props.onDayChanged(evt.target.value) }), _jsx("button", { type: "button", id: "btnNext", onClick: () => props.onDayChanged(getFormattedDate(dayAfterDate)), children: _jsx("span", { children: getShorthandedDayOfTheWeekName(dayAfterDate) }) })] }));
};
function appendChild(parent, props) {
    render(_jsx(Element, { date: props.date, onDayChanged: props.onDayChanged }), parent);
}
export { Element, appendChild };
