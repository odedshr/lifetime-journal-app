import { element } from "./setup.html.js";
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
