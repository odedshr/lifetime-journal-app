import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { render } from 'nano-jsx';
import { getFormattedDate, addToDate, getShorthandedDayOfTheWeekName } from './date-utils.js';
function onLinkClicked(onDayChanged, targetDate, evt) {
    onDayChanged(getFormattedDate(targetDate));
    evt.preventDefault();
}
const Element = (props) => {
    const date = new Date(props.date);
    const prevDate = addToDate(date, -1);
    const nextDate = addToDate(date, +1);
    const prevDayLink = `/entry/?day=${getFormattedDate(prevDate)}`;
    const todayLink = `/entry/?day=${getFormattedDate(new Date())}`;
    const nextDayLink = `/entry/?day=${getFormattedDate(nextDate)}`;
    return (_jsxs("div", { class: "date-selector", children: [_jsx("a", { id: "btnPrevious", class: "btn", href: prevDayLink, rel: "prev", title: "previous day", onClick: onLinkClicked.bind({}, props.onDayChanged, prevDate), children: _jsx("span", { children: getShorthandedDayOfTheWeekName(prevDate) }) }), _jsx("a", { id: "btnToday", class: "btn", href: todayLink, rel: "today", title: "Today", onClick: onLinkClicked.bind({}, props.onDayChanged, new Date()), children: _jsx("span", { children: "Today" }) }), props.children, _jsx("a", { id: "btnNext", class: "btn", href: nextDayLink, rel: "today", title: "Today", onClick: onLinkClicked.bind({}, props.onDayChanged, nextDate), children: _jsx("span", { children: getShorthandedDayOfTheWeekName(nextDate) }) })] }));
};
function appendChild(parent, props, children) {
    render(_jsx(Element, { date: props.date, onDayChanged: props.onDayChanged, children: children }), parent);
}
export { Element, appendChild };
