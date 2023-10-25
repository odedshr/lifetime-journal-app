import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { render } from 'nano-jsx';
import { isSameDate } from '../utils/date-utils.js';
const Element = (props) => {
    const { label, startDate, endDate } = props.data;
    const onClick = (evt) => {
        evt.preventDefault();
        props.onEditRequest && props.onEditRequest();
        return false;
    };
    const classes = ["period-item"];
    if (isSameDate(props.date, startDate)) {
        classes.push("period-start");
    }
    if (endDate && isSameDate(props.date, endDate)) {
        classes.push("period-end");
    }
    return _jsxs("li", { class: classes.join(" "), children: [_jsx("span", { class: "period-label", children: label }), props.onEditRequest ? _jsx("a", { href: "/periods/", title: "Edit period entry", class: "period-edit", onClick: onClick, children: _jsx("span", { children: "Edit" }) }) : null] });
};
function appendChild(parent, data, date, onEditRequest) {
    render(_jsx(Element, { data: data, date: date, onEditRequest: onEditRequest }), parent);
}
export { Element, appendChild };
