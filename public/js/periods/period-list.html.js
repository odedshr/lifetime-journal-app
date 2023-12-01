var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "nano-jsx/esm/jsx-runtime";
import { render } from 'nano-jsx';
import { Element as PeriodItem } from './period-item.html.js';
import { Element as PeriodDialog } from '../periods/period-dialog.html.js';
const Element = (props) => {
    let section;
    let list;
    const getListItems = (periods) => periods.map((item) => _jsx(PeriodItem, { date: props.date, data: item, onEditRequest: () => onPeriodEditRequest(item) }));
    const refreshList = (periods) => {
        while (list.children.length) {
            list.removeChild(list.children[0]);
        }
        render(getListItems(periods), list);
    };
    const onPeriodEditRequest = (period) => {
        if (period === undefined) {
            period = { id: undefined, label: '', startDate: props.date };
        }
        let dialog;
        const removedDialog = () => section.removeChild(dialog);
        const updatePeriod = (period, id) => __awaiter(void 0, void 0, void 0, function* () {
            const periods = yield props.onSetPeriod(period, id);
            if (Array.isArray(periods)) {
                refreshList(periods);
                removedDialog();
            }
            return periods;
        });
        const periodDialogProps = {
            period,
            onChanged: (period) => __awaiter(void 0, void 0, void 0, function* () { return updatePeriod(period, period.id); }),
            onCancel: removedDialog,
        };
        if (period.id !== undefined) {
            periodDialogProps.onDelete = () => __awaiter(void 0, void 0, void 0, function* () { return updatePeriod(null, period.id); });
        }
        dialog = PeriodDialog(periodDialogProps);
        section.appendChild(dialog);
        dialog.showModal();
    };
    props.onSetDelegate(onPeriodEditRequest);
    return (_jsx("section", { class: "periods", ref: (el) => { section = el; }, children: _jsx("ul", { ref: (el) => { list = el; }, children: getListItems(props.items) }) }));
};
export { Element };
