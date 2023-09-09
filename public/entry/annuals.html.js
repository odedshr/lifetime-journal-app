import { jsx as _jsx, jsxs as _jsxs } from "https://unpkg.com/https://unpkg.com/nano-jsx/esm/jsx-runtime/index.js/index.js";
import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
const Element = (props) => ((_jsxs("section", { children: [_jsx("div", { children: "On this day..." }), _jsx("ul", { children: props.items.map(item => _jsx("li", { children: item.label })) })] })));
function appendChild(parent, annuals) {
    render(_jsx(Element, { items: annuals }), parent);
}
export { Element, appendChild };
