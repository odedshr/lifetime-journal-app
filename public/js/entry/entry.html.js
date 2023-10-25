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
import { Element as Annuals } from '../annuals/annual-list.html.js';
import { Element as Periods } from '../periods/period-list.html.js';
import { Element as EntryView } from './entry-view.html.js';
import { Element as EntryEdit } from './entry-edit.html.js';
const Element = (props) => {
    let articleElm;
    let entryView;
    const attr = {};
    if (props.isEditMode) {
        attr['edit-mode'] = true;
    }
    const toggleEdit = () => articleElm.toggleAttribute('edit-mode');
    const onEntryChanged = (entry) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield props.onEntryChanged(entry);
        if (result) {
            render(_jsx(EntryView, { id: "entry-view", entry: entry }), entryView, true);
        }
        return result;
    });
    return (_jsxs("main", { class: "entry", children: [_jsx("header", { children: _jsx(DaySelector, { date: props.date, onDayChanged: props.onDayChanged }) }), _jsxs("article", Object.assign({ class: "entry-details" }, attr, { ref: (el) => articleElm = el, children: [_jsx(Periods, { date: new Date(props.date), items: props.periods, onEditRequest: props.onPeriodEditRequest }), _jsx(Annuals, { date: props.date, items: props.annuals, readonly: props.leapYearAnnuals, onEditRequest: props.onAnnualEditRequest }), _jsx("div", { class: "entry-view-wrapper", ref: (el) => { entryView = el; }, children: _jsx(EntryView, { id: "entry-view", entry: props.entry }) }), _jsx(EntryEdit, { entry: props.entry, onEntryChanged: onEntryChanged, onExitPage: toggleEdit }), _jsx("section", { id: "diaries" })] })), _jsxs("footer", { children: [_jsx("a", { href: "#", class: "btn", onClick: toggleEdit, children: _jsx("span", { children: "Edit" }) }), _jsx("a", { href: "#", class: "btn", onClick: () => props.onAnnualEditRequest(), children: _jsx("span", { children: "Add Annual" }) }), _jsx("a", { href: "#", class: "btn", onClick: () => props.onPeriodEditRequest(), children: _jsx("span", { children: "Add Period" }) })] })] }));
};
function appendChild(parent, dateString, entry, annuals, leapYear, periods, isEditMode, onDayChanged, onEntryChanged, onAnnualEditRequest, onPeriodEditRequest) {
    const element = _jsx(Element, { date: dateString, entry: entry, annuals: annuals, leapYearAnnuals: leapYear, periods: periods, isEditMode: isEditMode, onDayChanged: onDayChanged, onEntryChanged: onEntryChanged, onAnnualEditRequest: onAnnualEditRequest, onPeriodEditRequest: onPeriodEditRequest });
    render(element, parent);
}
export { appendChild };
