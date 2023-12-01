import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { getFormattedDate } from '../utils/date-utils.js';
function saveForm(formData, props) {
    let isDirty = false;
    if (formData.get('label') !== props.period.label) {
        props.period.label = formData.get('label');
        isDirty = true;
    }
    const start = new Date(formData.get('start'));
    if (start.getDate() !== props.period.startDate.getDate()) {
        props.period.startDate = start;
        isDirty = true;
    }
    const endString = formData.get('end') || undefined;
    if (endString && endString.length) {
        const end = new Date(endString);
        if (!props.period.endDate || end.getDate() !== props.period.endDate.getDate()) {
            props.period.endDate = end;
            isDirty = true;
        }
    }
    else if (props.period.endDate !== undefined) {
        props.period.endDate = undefined;
        isDirty = true;
    }
    if (formData.get('color') !== props.period.color) {
        props.period.color = formData.get('color');
        isDirty = true;
    }
    return isDirty ? props.onChanged(props.period) : true;
}
const Element = (props) => {
    let form;
    const { label, startDate, color, endDate } = props.period;
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
                confirm(`Delete period "${props.period.label}"?`) && props.onDelete && props.onDelete();
                break;
        }
        return false;
    };
    return _jsxs("dialog", { opened: true, children: [_jsx("h2", { children: "Edit Period" }), _jsxs("form", { method: "dialog", class: "period-edit-form", ref: (el) => form = el, onSubmit: onExitPage.bind({}, 'save'), children: [_jsxs("div", { children: [_jsx("label", { for: "period-label", children: "Label" }), _jsx("input", { type: "text", id: "period-label", name: "label", value: label, required: true })] }), _jsxs("div", { children: [_jsx("label", { for: "period-start", children: "Start year" }), _jsx("input", { type: "date", id: "period-start", name: "start", value: startDateString, required: true })] }), _jsxs("div", { children: [_jsx("label", { for: "period-end", children: "End year" }), _jsx("input", { type: "date", id: "period-end", name: "end", value: endDateString })] }), _jsxs("div", { children: [_jsx("label", { for: "period-color", children: "Color" }), _jsx("input", { type: "color", id: "period-color", name: "color", value: color })] }), _jsxs("footer", { class: "actions", children: [_jsx("button", { type: "submit", class: "btn-save", children: _jsx("span", { children: "Save" }) }), props.onCancel ?
                                _jsx("button", { type: "reset", class: "btn-cancel", onClick: onExitPage.bind({}, 'cancel'), children: _jsx("span", { children: "Cancel" }) }) : null, props.onDelete ?
                                _jsx("button", { type: "reset", class: "btn-delete", onClick: onExitPage.bind({}, 'delete'), children: _jsx("span", { children: "Delete" }) }) : null] })] })] });
};
export { Element };
