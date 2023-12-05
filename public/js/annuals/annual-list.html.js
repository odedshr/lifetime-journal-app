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
import { render } from 'nano-jsx';
import { Element as AnnualItem } from './annual-item.html.js';
import { Element as AnnualDialog } from './annual-dialog.html.js';
const Element = (props) => {
    let section;
    let list;
    let annuals = props.items;
    const getListItems = (annuals) => annuals.map((item, id) => _jsx(AnnualItem, { date: props.date, data: item, onEditRequest: () => onAnnualEditRequest(id) }));
    const refreshList = (annuals) => {
        while (list.children.length) {
            list.removeChild(list.children[0]);
        }
        render(getListItems(annuals), list);
    };
    const onAnnualEditRequest = (id) => {
        const annual = id === undefined ? { label: '', startYear: (new Date()).getFullYear() } : annuals[id];
        let dialog;
        const removedDialog = () => section.removeChild(dialog);
        const updateAnnual = (annuals, updated, id) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield props.onSetAnnuals(updated, id);
            if (Array.isArray(result)) {
                annuals = result;
                refreshList(annuals);
                removedDialog();
            }
            return annuals;
        });
        const annualDialogProps = {
            annual,
            onChanged: (annual) => __awaiter(void 0, void 0, void 0, function* () { return !!(yield updateAnnual(annuals, annual, id)); }),
            onCancel: removedDialog,
        };
        if (id !== undefined) {
            annualDialogProps.onDelete = () => __awaiter(void 0, void 0, void 0, function* () { return !!updateAnnual(annuals, null, id); });
        }
        dialog = AnnualDialog(annualDialogProps);
        section.appendChild(dialog);
        dialog.showModal();
    };
    props.onSetDelegate(onAnnualEditRequest);
    return (_jsx("section", { class: "annuals", ref: (el) => { section = el; }, children: _jsxs("ul", { ref: (el) => { list = el; }, children: [getListItems(props.items), getListItems(props.readonly)] }) }));
};
export { Element };
