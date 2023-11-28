var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function uploadJSON(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    resolve(JSON.parse(reader.result));
                }
                catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file); // Read the file as text
        });
    });
}
function validateDiaryContent(diaryContent) {
    const diarySettingsKeys = Object.keys(diaryContent.settings).sort();
    const errorMessages = [];
    if (JSON.stringify(diarySettingsKeys) !== `["defaultFields","name","startDate","uri"]`) {
        errorMessages.push(new Error("Diary content is not valid (settings)"));
    }
    if (Object.values(diaryContent.entries).find(entry => !entry.date || !entry.fields)) {
        errorMessages.push(new Error("Diary content is not valid (entries)"));
    }
    if (!diaryContent.annuals) {
        errorMessages.push(new Error("Diary content is not valid (annuals)"));
    }
    if (!diaryContent.periods) {
        errorMessages.push(new Error("Diary content is not valid (periods)"));
    }
    return errorMessages;
}
function exportDiary(diaryContent) {
    const json = JSON.stringify(diaryContent);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${diaryContent.settings.uri}.json`;
    link.click();
    URL.revokeObjectURL(url);
    return { blob, link };
}
function selectFileForUpload(fileInput) {
    return new Promise((resolve, reject) => {
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute('accept', "application/json");
        fileInput.addEventListener('change', () => {
            if (fileInput.files && fileInput.files.length > 0) {
                resolve(fileInput.files[0]);
            }
            else {
                reject('no file selected');
            }
        });
        fileInput.click();
    });
}
export { exportDiary, selectFileForUpload, uploadJSON, validateDiaryContent };
