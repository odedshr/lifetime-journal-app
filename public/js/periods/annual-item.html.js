import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { render } from 'nano-jsx';
import { isFirstDateBeforeSecondDate, getMmDdFromString } from '../utils/date-utils.js';
const Element = (props) => {
    const { label, startYear, color, endYear } = props.data;
    const onClick = (evt) => {
        evt.preventDefault();
        props.onEditRequest && props.onEditRequest();
        return false;
    };
    const now = new Date(props.date);
    const classes = ["annual-item"];
    if (isFirstDateBeforeSecondDate(now, new Date(`${startYear}-${getMmDdFromString(props.date)}`))) {
        classes.push("future-event");
    }
    if (endYear && isFirstDateBeforeSecondDate(new Date(`${endYear}-${getMmDdFromString(props.date)}`), now)) {
        classes.push("past-event");
    }
    return _jsxs("li", { class: classes.join(" "), children: [_jsx("span", { class: "annual-label", children: label }), _jsx("span", { class: "annual-start", children: startYear }), _jsx("span", { class: "annual-end", children: endYear }), props.onEditRequest ? _jsx("a", { href: "/annuals/", title: "Edit annual entry", class: "annual-edit", onClick: onClick, children: _jsx("span", { children: "Edit" }) }) : null] });
};
function appendChild(parent, data, date, onEditRequest) {
    render(_jsx(Element, { data: data, date: date, onEditRequest: onEditRequest }), parent);
}
export { Element, appendChild };
