import { jsx as _jsx, jsxs as _jsxs } from "https://unpkg.com/nano-jsx/esm/jsx-runtime/index.js";
import { render } from 'https://unpkg.com/nano-jsx@0.1.0/esm/index.js';
import { Element as Annuals } from './annuals.html.js';
const Element = (props) => (_jsxs("form", { children: ["item1", _jsx(Annuals, { items: props.annuals }), "item 2"] }));
function appendChild(parent, annuals) {
    render(_jsx(Element, { annuals: annuals }), parent);
}
function deploy(parent, delegates) {
    appendChild(parent, []);
}
export { deploy };
