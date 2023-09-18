import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { render } from 'nano-jsx';
const Element = (props) => ((_jsxs("section", { children: [_jsx("div", { children: "On this day..." }), _jsx("ul", { children: props.items.map(item => _jsx("li", { children: item.label })) })] })));
function appendChild(parent, annuals) {
    render(_jsx(Element, { items: annuals }), parent);
}
export { Element, appendChild };
