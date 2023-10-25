import { jsx as _jsx } from "nano-jsx/esm/jsx-runtime";
import { Element as PeriodItem } from './period-item.html.js';
const Element = (props) => (_jsx("ul", { class: "periods", children: props.items.map((item) => _jsx(PeriodItem, { date: props.date, data: item, onEditRequest: () => props.onEditRequest(item.id) })) }));
export { Element };
