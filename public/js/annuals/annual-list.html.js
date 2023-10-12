import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { render } from 'nano-jsx';
import { Element as AnnualItem } from './annual-item.html.js';
const Element = (props) => (_jsxs("ul", { class: "annuals", children: [props.items.map((item, id) => _jsx(AnnualItem, { date: props.date, data: item, onEditRequest: () => props.onEditRequest(id) })), props.readonly.map(item => _jsx(AnnualItem, { date: props.date, data: item }))] }));
function appendChild(parent, date, annuals, readonly, onEditRequest) {
    render(_jsx(Element, { items: annuals, readonly: readonly, date: date, onEditRequest: onEditRequest }), parent);
}
export { Element, appendChild };
