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
import { Element as DaySelector } from '../utils/yyyy-mm-dd-selector.html.js';
import { Element as Periods } from './period-list.html.js';
import { Element as EditPeriod } from './period-edit.html.js';
const EMPTY_PERIOD = {
    id: undefined,
    label: '',
    startDate: new Date(),
};
function onPeriodChanged(props, period) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield props.onPeriodChanged(period)) {
            props.onExitPage();
        }
        return false; // prevent default behavior of form submission
    });
}
const Element = (props) => {
    const date = new Date(props.date);
    const editedPeriod = props.id !== undefined ? props.periods.find(period => period.id === props.id) : undefined;
    return (_jsxs("main", { class: "periods", children: [_jsx("header", { children: _jsx(DaySelector, { date: props.date, onDayChanged: props.onDayChanged }) }), editedPeriod ?
                _jsx(EditPeriod, { data: editedPeriod, onChanged: onPeriodChanged.bind({}, props), onCancel: props.onExitPage, onDelete: props.onDeletePeriodRequested.bind({}, props.id) }) :
                _jsxs("section", { children: [_jsx(Periods, { date: date, items: props.periods, onEditRequest: props.onPeriodEditRequest }), _jsx(EditPeriod, { data: EMPTY_PERIOD, onCancel: props.onExitPage, onChanged: onPeriodChanged.bind({}, props) })] })] }));
};
function appendChild(parent, dateString, periods, onDayChanged, onPeriodChanged, onPeriodEditRequest, onDeletePeriodRequested, onExitPage, id) {
    const date = new Date(dateString);
    render(_jsx(Element, { date: dateString, periods: periods, onDayChanged: onDayChanged, onPeriodChanged: onPeriodChanged, onPeriodEditRequest: onPeriodEditRequest, onDeletePeriodRequested: onDeletePeriodRequested, onExitPage: onExitPage, id: id }), parent);
}
export { appendChild };
