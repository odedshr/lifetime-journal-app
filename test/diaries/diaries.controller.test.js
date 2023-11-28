import { jest } from '@jest/globals';

jest.unstable_mockModule('../../public/js/firebase.app.js', () => ({
  app: jest.fn(() => ({ type: 'app' })),
  getAuthenticateUser: jest.fn(async () => ({ type: 'user' })),
  switchToSignOutPage: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));


jest.unstable_mockModule('../../public/js/db.js', () => ({
  DEFAULT_DIARY: { uri: 'default-diary' },
  getDiary: jest.fn(async () => ({ uri: 'diary-01' })),
  getUserSettings: jest.fn(async () => ({ currentDiaryIndex: 0, diaries: [{ uri: 'diary-01' }] })),
  saveUserSettings: jest.fn(),
  deleteDiaryContent: jest.fn(),
  getDiaryContent: jest.fn(async (a, b, c) => ({ uri: 'diary-content' })),
  setDiaryContent: jest.fn(async () => ({})),
}));

jest.unstable_mockModule('../../public/js/init.js', () => ({
  redirectTo: jest.fn(() => ({})),
}));

let props = [];
jest.unstable_mockModule('../../public/js/diaries/diaries.html.js', () => ({
  appendChild: jest.fn((...args) => { props = args; })
}));

jest.unstable_mockModule('../../public/js/utils/date-utils.js', () => ({
  getDisplayableDate: jest.fn(() => ('xxx')),
  getFormattedDate: jest.fn(() => ('yyyy-mm-dd')),
  getShorthandedDayOfTheWeekName: jest.fn(),
  addToDate: jest.fn(),
  getMmDd: jest.fn((date) => (`mm/dd(${date.toISOString().split('T')[0]})`)),
  isDateStringValid: jest.fn(),
  LEAP_YEAR_MONTH_LENGTH: [],
  MONTH_NAMES: []
}));

const { app } = await import('../../public/js/firebase.app.js');
const { switchPage } = await import('../../public/js/diaries/diaries.controller.js');
const { deleteDiaryContent,
  setDiaryContent,
  getDiaryContent,
  getDiary,
  getUserSettings,
  saveUserSettings,
  DEFAULT_DIARY } = await import('../../public/js/db.js');
const { appendChild } = await import('../../public/js/diaries/diaries.html.js');

describe('Diaries.Controller', () => {

  describe('switchPage', () => {

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('sets page title', async () => {
      await switchPage({}, '2023-01-13');
      expect(document.title).toEqual('My Diaries | Lifetime Journal');
    });

    it('gets diary list', async () => {
      await switchPage({}, '2023-01-01');
      expect(getUserSettings).toHaveBeenCalledWith(
        expect.any(Function), {});
    });

    it('appends page content', async () => {
      await switchPage({}, '2023-01-01');
      expect(appendChild).toHaveBeenCalled();
    });

    it('onRequestGetDiaryContent gets diary content', async () => {
      await switchPage({}, '2023-01-01', 1);
      props[1].onRequestGetDiaryContent({ uri: 'diary-01' });
      expect(getDiaryContent).toHaveBeenCalledWith(app, {}, { uri: 'diary-01' });
    });

    it('onRequestSetDiaryContent writes a new diary', async () => {
      const diaryContent = { content: "content" }
      await switchPage({}, '2023-01-01', 1);
      props[1].onRequestSetDiaryContent(diaryContent, "replace");
      expect(setDiaryContent).toHaveBeenCalledWith(app, {},
        { diaries: [{ uri: "diary-01" }], currentDiaryIndex: 0 },
        diaryContent, "replace");
    });

    it('onRequestDeleteDiary adds default diary', async () => {
      await switchPage({}, '2023-01-01', 1);
      const result = await props[1].onRequestDeleteDiary(0);
      expect(saveUserSettings).toHaveBeenCalledWith(app, {},
        { diaries: [{ uri: "default-diary" }], currentDiaryIndex: 0 });
      expect(deleteDiaryContent).toHaveBeenCalledWith(app, {}, "diary-01");
      expect(result).toEqual([{ uri: "default-diary" }]);
    });

    it('onSelectDiary set currentDiaryIndex', async () => {
      await switchPage({}, '2023-01-01', 1);
      await props[1].onSelectDiary(2);
      expect(saveUserSettings).toHaveBeenCalledWith(app, {},
        { diaries: [{ uri: "diary-01" }], currentDiaryIndex: 2 });
    });
  });
});