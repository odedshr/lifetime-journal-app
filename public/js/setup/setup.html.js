import { jsx as _jsx, jsxs as _jsxs } from "https://unpkg.com/nano-jsx/esm/jsx-runtime/index.js";
const element = _jsxs("form", { id: "setup", action: "/setup", method: "post", children: [_jsx("h1", { children: "Let's set up a new diary" }), _jsx("label", { for: "startDate", children: "Start Date" }), _jsx("input", { type: "date", name: "startDate", id: "startDate" }), _jsx("button", { type: "submit", id: "submit", children: _jsx("span", { children: "Next" }) })] });
function deploy(parent, delegates) {
    parent.replaceChildren(element);
    const form = element;
    form.onsubmit = submit.bind(null, delegates.onSaveDiary);
}
function submit(onSaveDiary, evt) {
    const formData = new FormData(evt.target);
    onSaveDiary({
        startDate: formData.get("startDate"),
        name: "diary-01"
    });
    evt.preventDefault();
    return false;
}
export { deploy };
