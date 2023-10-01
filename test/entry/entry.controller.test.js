import { jest } from '@jest/globals';

jest.unstable_mockModule('../../public/js/firebase.app.js', () => ({
  app: jest.fn(() => ({ type: 'app' })),
  getAuthenticateUser: jest.fn(async () => ({ type: 'user' })),
  switchToSignOutPage: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));


jest.unstable_mockModule('../../public/js/db.js', () => ({
  getUserSettings: jest.fn(async () => ({ diaries: [] })),
  getDayEntry: jest.fn(async () => ({})),
  setDayEntry: jest.fn(async () => ({}))
}));

jest.unstable_mockModule('../../public/js/entry/entry.html.js', () => ({
  appendChild: jest.fn(async () => ({}))
}));

jest.unstable_mockModule('../../public/js/utils/date-utils.js', () => ({
  getDisplayableDate: jest.fn(() => ('xxx')),
  getFormattedDate: jest.fn(() => ('yyyy-mm-dd')),
}));

const { switchPage } = await import('../../public/js/entry/entry.controller.js');
const { getUserSettings } = await import('../../public/js/db.js');
const { appendChild } = await import('../../public/js/entry/entry.html.js');
const { getDayEntry } = await import('../../public/js/db.js');

describe('Entry.Controller', () => {

  describe('switchPage', () => {

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('sets page title', async () => {
      await switchPage({}, '2023-01-13');
      expect(document.title).toEqual('xxx | Lifetime Journal');
    });

    it('gets user settings', async () => {
      await switchPage({}, '2023-01-01');
      expect(getUserSettings).toHaveBeenCalledWith(
        expect.any(Function), {});
    });

    it('gets entry for default diary if none configured', async () => {
      getUserSettings.mockResolvedValueOnce({ diaries: [] });
      await switchPage({}, '2023-01-01');
      expect(getDayEntry).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
        { "uri": "diary-01" },
        '2023-01-01'
      );
    });

    it('gets entry for configured diary', async () => {
      getUserSettings.mockResolvedValueOnce({
        diaries: [{ "uri": "custom" }]
      });
      await switchPage({}, '2023-01-01');
      expect(getDayEntry).toHaveBeenCalledWith(
        expect.any(Function),
        {},
        { "uri": "custom" },
        '2023-01-01'
      );
    });

    it('appends page content', async () => {
      await switchPage({}, '2023-01-01');
      expect(appendChild).toHaveBeenCalled();
    });

  });
});