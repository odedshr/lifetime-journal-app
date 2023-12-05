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
import { Element as DaySelector } from '../utils/mm-dd-selector.html.js';
import { Element as EditAnnual } from './annual-edit.html.js';
const EMPTY_ANNUAL = {
    label: '',
    startYear: (new Date()).getFullYear(),
};
function onAnnualChanged(props, newEntry) {
    return __awaiter(this, void 0, void 0, function* () {
        if (props.id === undefined) {
            props.annuals.push(newEntry);
        }
        else {
            props.annuals[props.id] = newEntry;
        }
        if (yield props.onAnnualChanged(props.annuals)) {
            props.onExitPage();
        }
        return false; // prevent default behavior of form submission
    });
}
const Element = (props) => (_jsxs("main", { class: "annuals", children: [_jsx("header", { children: _jsx(DaySelector, { date: props.date, onDayChanged: props.onDayChanged }) }), (props.id !== undefined) ?
            _jsx(EditAnnual, { data: props.annuals[props.id], onChanged: onAnnualChanged.bind({}, props), onCancel: props.onExitPage, onDelete: props.onDeleteAnnualRequested.bind({}, props.id) }) :
            _jsx("section", { children: _jsx(EditAnnual, { data: EMPTY_ANNUAL, onCancel: props.onExitPage, onChanged: onAnnualChanged.bind({}, props) }) })] }));
function appendChild(parent, dateString, annuals, leapYear, onDayChanged, onAnnualChanged, onAnnualEditRequest, onDeleteAnnualRequested, onExitPage, id) {
    render(_jsx(Element, { date: dateString, annuals: annuals, leapYear: leapYear, onDayChanged: onDayChanged, onAnnualChanged: onAnnualChanged, onAnnualEditRequest: onAnnualEditRequest, onDeleteAnnualRequested: onDeleteAnnualRequested, onExitPage: onExitPage, id: id }), parent);
}
export { appendChild };
