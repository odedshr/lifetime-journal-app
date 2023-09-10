import { jsx as _jsx, jsxs as _jsxs } from "https://unpkg.com/nano-jsx/esm/jsx-runtime/index.js";
import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
const Element = (props) => (_jsxs("main", { children: [_jsxs("header", { children: [_jsx("button", { id: "btnPrevious", onClick: props.onBtnPrevClicked, children: _jsx("span", { children: "Previous" }) }), _jsx("button", { id: "btnToday", onClick: props.onBtnTodayClicked, children: _jsx("span", { children: "Today" }) }), _jsx("label", { for: "entry-date", children: "Navigate to date:" }), _jsx("input", { type: "date", id: "entry-date", name: "entry-date", value: props.date, onChange: props.onSetDayChanged }), _jsx("button", { id: "btnNext", onClick: props.onBtnNextClicked, children: _jsx("span", { children: "Next" }) })] }), _jsx("section", { id: "recurring" }), _jsxs("section", { id: "entry", children: [_jsx("label", { for: "entry-text", children: "Entry:" }), _jsx("textarea", { id: "entry-text", name: "entry-text", rows: "10", cols: "50", onChange: props.onEntryChanged, children: props.entry ? props.entry.fields[0].value : '' })] }), _jsx("section", { id: "periods" }), _jsx("section", { id: "diaries" })] }));
function appendChild(parent, dateString, entry, onBtnPrevClicked, onBtnTodayClicked, onBtnNextClicked, onSetDayChanged, onEntryChanged, annuals) {
    render(_jsx(Element, { date: dateString, entry: entry, annuals: annuals, onBtnPrevClicked: onBtnPrevClicked, onBtnTodayClicked: onBtnTodayClicked, onBtnNextClicked: onBtnNextClicked, onSetDayChanged: onSetDayChanged, onEntryChanged: onEntryChanged }), parent);
}
function getFormattedDate(date) {
    return date.toISOString().split('T')[0];
}
function addToDate(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return getFormattedDate(date);
}
function getDisplayableDate(date) {
    return date.toLocaleDateString(navigator.language);
}
function deploy(parent, dateString, entry, delegates) {
    document.title = `${getDisplayableDate(new Date(dateString))} | Lifetime Journal`;
    appendChild(parent, dateString, entry, () => delegates.onDateChanged(addToDate(dateString, -1)), () => delegates.onDateChanged(getFormattedDate(new Date())), () => delegates.onDateChanged(addToDate(dateString, +1)), (evt) => delegates.onDateChanged(evt.target.value), (evt) => delegates.onEntryChanged({
        date: dateString,
        fields: [{ type: "text", value: evt.target.value }]
    }), []);
}
export { deploy };
