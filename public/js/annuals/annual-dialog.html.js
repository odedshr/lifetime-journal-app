import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
function saveForm(formData, props) {
    let isDirty = false;
    if (formData.get('label') !== props.annual.label) {
        props.annual.label = formData.get('label');
        isDirty = true;
    }
    if (+formData.get('start') !== props.annual.startYear) {
        props.annual.startYear = +formData.get('start');
        isDirty = true;
    }
    const endYear = +formData.get('end') || undefined;
    if (endYear !== props.annual.endYear) {
        props.annual.endYear = endYear;
        isDirty = true;
    }
    if (formData.get('color') !== props.annual.color) {
        props.annual.color = formData.get('color');
        isDirty = true;
    }
    return isDirty ? props.onChanged(props.annual) : true;
}
const Element = (props) => {
    let form;
    const { label, startYear, color, endYear } = props.annual;
    const onExitPage = (action, evt) => {
        evt.preventDefault();
        switch (action) {
            case 'save':
                saveForm(new FormData(form), props);
                break;
            case 'cancel':
                return props.onCancel && props.onCancel();
            case 'delete':
                return props.onDelete && props.onDelete();
        }
        return false;
    };
    return _jsxs("dialog", { opened: true, children: [_jsx("h2", { children: "Edit Annual Event" }), _jsxs("form", { class: "annual-edit-form", ref: (el) => form = el, onSubmit: onExitPage.bind({}, 'save'), children: [_jsxs("div", { children: [_jsx("label", { for: "annual-label", children: "Label" }), _jsx("input", { type: "text", id: "annual-label", name: "label", value: label, required: true })] }), _jsxs("div", { children: [_jsx("label", { for: "annual-startYear", children: "Start year" }), _jsx("input", { type: "number", step: "1", id: "annual-startYear", name: "start", value: startYear, required: true })] }), _jsxs("div", { children: [_jsx("label", { for: "annual-endYear", children: "End year" }), _jsx("input", { type: "number", step: "1", id: "annual-endYear", name: "end", value: endYear !== undefined ? endYear : '' })] }), _jsxs("div", { children: [_jsx("label", { for: "annual-color", children: "Color" }), _jsx("input", { type: "color", id: "annual-color", name: "color", value: color })] }), _jsxs("footer", { class: "actions", children: [_jsx("button", { type: "submit", class: "btn-save", children: _jsx("span", { children: "Save" }) }), props.onCancel ?
                                _jsx("button", { type: "reset", class: "btn-cancel", onClick: onExitPage.bind({}, 'cancel'), children: _jsx("span", { children: "Cancel" }) }) : null, props.onDelete ?
                                _jsx("button", { type: "reset", class: "btn-delete", onClick: onExitPage.bind({}, 'delete'), children: _jsx("span", { children: "Delete" }) }) : null] })] })] });
};
export { Element };
