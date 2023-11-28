var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
const Element = (props) => {
    let dialog;
    let form;
    let defaultFields;
    const showModal = (diary) => {
        dialog.querySelector('#diary-name').value = diary.name;
        dialog.querySelector('#diary-uri').value = diary.uri;
        dialog.querySelector('#diary-color').value = diary.color;
        dialog.querySelector('#diary-startDate').value = diary.startDate;
        defaultFields = diary.defaultFields;
        dialog.showModal();
    };
    props.onDelegatorProvided(showModal);
    function onSave(evt) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData(form);
            if (formData.get("action") === "save") {
                if (form.reportValidity()) {
                    const errors = yield props.onSaveRequest({
                        name: formData.get("name"),
                        uri: formData.get("uri"),
                        startDate: formData.get("startDate"),
                        color: formData.get("color"),
                        defaultFields
                    });
                    if (errors.length) {
                        console.log("errors:", errors);
                        evt.preventDefault();
                        return false;
                    }
                }
            }
        });
    }
    return (_jsx("dialog", { ref: (el) => dialog = el, children: _jsxs("form", { method: "dialog", ref: (el) => form = el, children: [_jsxs("div", { children: [_jsx("label", { for: "diary-name", children: "Name" }), _jsx("input", { type: "text", id: "diary-name", name: "name", required: true })] }), _jsxs("div", { children: [_jsx("label", { for: "diary-uri", children: "URI" }), _jsx("input", { type: "text", id: "diary-uri", name: "uri", required: true })] }), _jsxs("div", { children: [_jsx("label", { for: "diary-name", children: "Start Date" }), _jsx("input", { type: "date", id: "diary-startDate", name: "startDate" })] }), _jsxs("div", { children: [_jsx("label", { for: "diary-color", children: "Color" }), _jsx("input", { type: "color", id: "diary-color", name: "color" })] }), _jsxs("div", { children: [_jsx("button", { type: "submit", value: "save", name: "action", onClick: onSave, children: "Save" }), _jsx("button", { value: "cancel", name: "action", children: "Cancel" })] })] }) }));
};
export { Element };
