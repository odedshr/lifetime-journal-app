import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { render } from 'nano-jsx';
import { MONTH_NAMES, LEAP_YEAR_MONTH_LENGTH, getFormattedDate } from './date-utils.js';
import { Element as DateSelector } from './date-selector.html.js';
const Element = (props) => {
    let monthSelector;
    let daySelector;
    const date = new Date(props.date);
    const month = date.getMonth();
    const day = date.getDate();
    const days = Array(LEAP_YEAR_MONTH_LENGTH[month]).fill(0).map((_, i) => (i + 1));
    const onMonthChanged = () => {
        date.setMonth(+monthSelector.value);
        props.onDayChanged(getFormattedDate(date));
    };
    const onDayChanged = () => {
        date.setDate(+daySelector.value);
        props.onDayChanged(getFormattedDate(date));
    };
    return _jsxs(DateSelector, { date: props.date, onDayChanged: props.onDayChanged, children: [_jsx("select", { class: "month-selector", title: "Select Month", ref: (el) => monthSelector = el, onChange: onMonthChanged, children: MONTH_NAMES.map((name, i) => (i === month) ? _jsx("option", { value: month, selected: true, children: name }) : _jsx("option", { value: i, children: name })) }), _jsx("select", { class: "day-selector", title: "Select Day", ref: (el) => daySelector = el, onChange: onDayChanged, children: days.map((v) => (v === day) ? _jsx("option", { value: v, selected: true, children: v }) : _jsx("option", { value: v, children: v })) })] });
};
function appendChild(parent, props) {
    render(_jsx(Element, { date: props.date, onDayChanged: props.onDayChanged }), parent);
}
export { Element, appendChild };
