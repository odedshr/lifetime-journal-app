import { DiaryContent } from "../types.js";

async function uploadJSON<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result as string) as T)
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsText(file); // Read the file as text
  });
}

function validateDiaryContent(diaryContent: DiaryContent) {
  const diarySettingsKeys = Object.keys(diaryContent.settings).sort();
  const errorMessages: Error[] = [];

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

function exportDiary(diaryContent: DiaryContent) {
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

function selectFileForUpload(fileInput: HTMLInputElement): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute('accept', "application/json");
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        resolve(fileInput.files[0]);
      } else {
        reject('no file selected');
      }
    });
    fileInput.click();
  });
}

export { exportDiary, selectFileForUpload, uploadJSON, validateDiaryContent };