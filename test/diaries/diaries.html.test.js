import { jest } from '@jest/globals';

const diary1 = { uri: "uri1", name: "name1" };
const diary2 = { uri: "uri2", name: "name2" }
const diaries = [diary1, diary2];
const selected = 0;
const onRequestGetDiaryContent = jest.fn();
const onRequestSetDiaryContent = jest.fn(() => [diary1, diary2]);
const onRequestDeleteDiary = jest.fn(() => ([{ settings: diary1 }]));
const onSelectDiary = jest.fn();
const props = {
  diaries,
  selected,
  onRequestGetDiaryContent,
  onRequestSetDiaryContent,
  onRequestDeleteDiary,
  onSelectDiary
};

jest.unstable_mockModule('../../public/js/diaries/diary-utils.js', () => ({
  exportDiary: jest.fn(),
  selectFileForUpload: jest.fn(callback => (new File(["content"], "filename"))),
  uploadJSON: jest.fn(() => ({ settings: diary2 })),
  validateDiaryContent: jest.fn(() => [])
}));

let modalShown = false;
let saveRequest;

jest.unstable_mockModule('../../public/js/diaries/diary-save-dialog.html.js', () => ({
  Element: jest.fn(({ onDelegatorProvided, onSaveRequest }) => {
    onDelegatorProvided(() => { modalShown = true; });
    saveRequest = onSaveRequest;
  })
}));

global.confirm = () => true;

const { appendChild, Element } = await import('../../public/js/diaries/diaries.html.js');
const { exportDiary, selectFileForUpload, uploadJSON, validateDiaryContent } = await import('../../public/js/diaries/diary-utils.js');

describe('Diaries', () => {

  describe('appendChild', () => {
    it('renders Element', () => {
      const parent = document.createElement('div');

      appendChild(parent, props);

      expect(parent.querySelector(".diaries")).not.toBeNull();
      expect(parent.querySelectorAll(".btn-download").length).toBe(2);
    });
  });

  describe('Select Diary', () => {
    it('calls onSelectDiary', async () => {
      const element = Element(props);

      await element.querySelector("li a").click();
      expect(props.onSelectDiary).toHaveBeenCalledWith(0);
    });
  });

  describe('Delete Diary', () => {
    it('calls onRequestDeleteDiary', async () => {
      const element = Element(props);

      await element.querySelector(".btn-delete").click();
      expect(props.onRequestDeleteDiary).toHaveBeenCalledWith(0);
    });
  });


  describe('Export Diary', () => {
    it('calls onRequestGetDiaryContent', async () => {
      const element = Element(props);

      await element.querySelector(".btn-download").click();
      expect(props.onRequestGetDiaryContent).toHaveBeenCalledWith({ "settings": diary1 });
    });
  });

  describe('Import Diary', () => {
    it('calls onRequestSetDiaryContent', async () => {
      const element = Element(props);
      modalShown = false;
      await element.querySelector("#import").click();
      await (new Promise(process.nextTick));

      expect(modalShown).toBeTruthy();
    });

    it('shows errors when validation fails', async () => {
      const element = Element(props);
      validateDiaryContent.mockImplementationOnce(() => ['error1']);

      modalShown = false;
      global.console.log = jest.fn();
      await element.querySelector("#import").click();
      await (new Promise(process.nextTick));

      expect(modalShown).toBeFalsy();
      expect(global.console.log).toHaveBeenCalled();
    });

    it('saves a file that was approved in the dialog', async () => {
      Element(props);
      const errors = await saveRequest({ uri: "new-uri" });
      await (new Promise(process.nextTick));
      expect(props.onRequestSetDiaryContent).toHaveBeenCalledWith({ settings: { uri: "new-uri" } }, "replace");
      expect(errors).toEqual([]);
    });
  });
});