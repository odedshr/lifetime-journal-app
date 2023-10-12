import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { render } from 'nano-jsx';
function saveForm(formData, props) {
    let isDirty = false;
    if (formData.get('label') !== props.data.label) {
        props.data.label = formData.get('label');
        isDirty = true;
    }
    if (+formData.get('start') !== props.data.startYear) {
        props.data.startYear = +formData.get('start');
        isDirty = true;
    }
    const endYear = +formData.get('end') || undefined;
    if (endYear !== props.data.endYear) {
        props.data.endYear = endYear;
        isDirty = true;
    }
    if (formData.get('color') !== props.data.color) {
        props.data.color = formData.get('color');
        isDirty = true;
    }
    return isDirty ? props.onChanged(props.data) : true;
}
const Element = (props) => {
    let form;
    const { label, startYear, color, endYear } = props.data;
    const onExitPage = (action, evt) => {
        evt.preventDefault();
        switch (action) {
            case 'save':
                saveForm(new FormData(form), props);
                break;
            case 'cancel':
                props.onCancel && props.onCancel();
                break;
            case 'delete':
                props.onDelete && props.onDelete();
                break;
        }
        return false;
    };
    return _jsxs("form", { class: "annual-edit-form", ref: (el) => form = el, onSubmit: onExitPage.bind({}, 'save'), children: [_jsxs("div", { children: [_jsx("label", { for: "annual-label", children: "Label" }), _jsx("input", { type: "text", id: "annual-label", name: "label", value: label, required: true })] }), _jsxs("div", { children: [_jsx("label", { for: "annual-startYear", children: "Start year" }), _jsx("input", { type: "number", step: "1", id: "annual-startYear", name: "start", value: startYear, required: true })] }), _jsxs("div", { children: [_jsx("label", { for: "annual-endYear", children: "End year" }), _jsx("input", { type: "number", step: "1", id: "annual-endYear", name: "end", value: endYear !== undefined ? endYear : '' })] }), _jsxs("div", { children: [_jsx("label", { for: "annual-color", children: "Color" }), _jsx("input", { type: "color", id: "annual-color", name: "color", value: color })] }), _jsxs("footer", { class: "actions", children: [_jsx("button", { type: "submit", class: "btn-save", children: _jsx("span", { children: "Save" }) }), props.onCancel ?
                        _jsx("button", { type: "reset", class: "btn-cancel", onClick: onExitPage.bind({}, 'cancel'), children: _jsx("span", { children: "Cancel" }) }) : null, props.onDelete ?
                        _jsx("button", { type: "reset", class: "btn-delete", onClick: onExitPage.bind({}, 'delete'), children: _jsx("span", { children: "Delete" }) }) : null] })] });
};
function appendChild(parent, data, onChanged, onDelete, onCancel) {
    render(_jsx(Element, { data: data, onChanged: onChanged, onDelete: onDelete, onCancel: onCancel }), parent);
}
export { Element, appendChild };
