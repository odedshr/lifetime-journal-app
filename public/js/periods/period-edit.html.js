import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { getFormattedDate } from '../utils/date-utils.js';
function saveForm(formData, props) {
    let isDirty = false;
    if (formData.get('label') !== props.data.label) {
        props.data.label = formData.get('label');
        isDirty = true;
    }
    const start = new Date(formData.get('start'));
    if (start.getDate() !== props.data.startDate.getDate()) {
        props.data.startDate = start;
        isDirty = true;
    }
    const endString = formData.get('end') || undefined;
    if (endString && endString.length) {
        const end = new Date(endString);
        if (!props.data.endDate || end.getDate() !== props.data.endDate.getDate()) {
            props.data.endDate = end;
            isDirty = true;
        }
    }
    else if (props.data.endDate !== undefined) {
        props.data.endDate = undefined;
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
    const { label, startDate, color, endDate } = props.data;
    const startDateString = startDate ? getFormattedDate(startDate) : '';
    const endDateString = endDate ? getFormattedDate(endDate) : '';
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
    return _jsxs("form", { class: "period-edit-form", ref: (el) => form = el, onSubmit: onExitPage.bind({}, 'save'), children: [_jsxs("div", { children: [_jsx("label", { for: "period-label", children: "Label" }), _jsx("input", { type: "text", id: "period-label", name: "label", value: label, required: true })] }), _jsxs("div", { children: [_jsx("label", { for: "period-start", children: "Start year" }), _jsx("input", { type: "date", id: "period-start", name: "start", value: startDateString, required: true })] }), _jsxs("div", { children: [_jsx("label", { for: "period-end", children: "End year" }), _jsx("input", { type: "date", id: "period-end", name: "end", value: endDateString })] }), _jsxs("div", { children: [_jsx("label", { for: "period-color", children: "Color" }), _jsx("input", { type: "color", id: "period-color", name: "color", value: color })] }), _jsxs("footer", { class: "actions", children: [_jsx("button", { type: "submit", class: "btn-save", children: _jsx("span", { children: "Save" }) }), props.onCancel ?
                        _jsx("button", { type: "reset", class: "btn-cancel", onClick: onExitPage.bind({}, 'cancel'), children: _jsx("span", { children: "Cancel" }) }) : null, props.onDelete ?
                        _jsx("button", { type: "reset", class: "btn-delete", onClick: onExitPage.bind({}, 'delete'), children: _jsx("span", { children: "Delete" }) }) : null] })] });
};
export { Element };
