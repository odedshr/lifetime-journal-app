import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { render } from 'nano-jsx';
const Element = (props) => {
    return (_jsxs("main", { class: "page-not-found", children: [_jsx("h1", { children: "404: Page Not Found" }), _jsx("h2", { children: "Not all those who wander are lost" }), _jsx("p", { children: "The specified file was not found on this website. Please check the URL for mistakes and try again." })] }));
};
function appendChild(parent, props = {}) {
    render(_jsx(Element, {}), parent);
}
export { appendChild };
