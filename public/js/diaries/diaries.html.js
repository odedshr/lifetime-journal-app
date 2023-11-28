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
import { exportDiary, selectFileForUpload, uploadJSON, validateDiaryContent } from './diary-utils.js';
import { Element as SaveDiaryDialog } from './diary-save-dialog.html.js';
const Element = (props) => {
    let diaryList;
    let showModalDialog;
    let draftDiary;
    function refreshList() {
        while (diaryList.children.length) {
            diaryList.removeChild(diaryList.children[0]);
        }
        render(props.diaries.map((diary, i) => getDiaryItem(diary, i, i === props.selected)), diaryList);
    }
    function requestDownload(diary) {
        return __awaiter(this, void 0, void 0, function* () {
            exportDiary(yield props.onRequestGetDiaryContent(diary));
        });
    }
    function selectDiary(diaryIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            yield props.onSelectDiary(diaryIndex);
            props.selected = diaryIndex;
            refreshList();
        });
    }
    function requestDelete(diaryIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            if (confirm(`Delete Diary "${props.diaries[diaryIndex].name}"?`)) {
                props.diaries = yield props.onRequestDeleteDiary(diaryIndex);
                refreshList();
            }
        });
    }
    const onFileSelected = (file) => __awaiter(void 0, void 0, void 0, function* () {
        draftDiary = yield uploadJSON(file);
        const errorMessages = validateDiaryContent(draftDiary);
        if (errorMessages.length) {
            console.log(errorMessages);
        }
        else {
            showModalDialog(draftDiary.settings);
        }
    });
    function onSave(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            props.diaries = yield props.onRequestSetDiaryContent(Object.assign(Object.assign({}, draftDiary), { settings }), 'replace');
            refreshList();
            return [];
        });
    }
    const getDiaryItem = (diary, index, selected) => _jsxs("li", Object.assign({}, (selected ? { 'data-selected': true } : {}), { children: [_jsx("a", { href: `#set=${diary.uri}`, onClick: (selectDiary.bind({}, index)), children: diary.name }), "\u00A0", _jsx("a", { href: `#delete=${diary.uri}`, class: "btn-delete", onClick: requestDelete.bind({}, index), children: "Delete" }), "\u00A0", _jsx("a", { href: `#download=${diary.uri}`, class: "btn-download", onClick: requestDownload.bind({}, diary), children: "Download" })] }));
    const onDelegatorProvided = (delegate) => { showModalDialog = delegate; };
    const onImportClicked = () => __awaiter(void 0, void 0, void 0, function* () { return onFileSelected(yield selectFileForUpload(document.createElement('input'))); });
    return (_jsxs("main", { class: "overview", children: [_jsx("header", { children: "Diaries" }), _jsx("article", { children: _jsx("ul", { ref: (el) => diaryList = el, class: "diaries", children: props.diaries.map((diary, i) => getDiaryItem(diary, i, i === props.selected)) }) }), _jsx(SaveDiaryDialog, { onDelegatorProvided: onDelegatorProvided, onSaveRequest: onSave }), _jsx("footer", { children: _jsx("a", { href: "#", id: "import", class: "btn", onClick: onImportClicked, children: _jsx("span", { children: "Import" }) }) })] }));
};
function appendChild(parent, props) {
    render(_jsx(Element, Object.assign({}, props)), parent);
}
export { appendChild, Element };
