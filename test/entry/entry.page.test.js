import { jest } from '@jest/globals';
import { getDisplayableDate } from '../../public/js/utils/date-utils.js';

jest.unstable_mockModule('../../public/js/firebase.app.js', () => ({
  app: jest.fn(() => ({ type: 'app' })),
  getAuthenticateUser: jest.fn(async () => ({ type: 'user' })),
  switchToSignOutPage: jest.fn()
}));


jest.unstable_mockModule('../../public/js/db.js', () => ({
  getUserSettings: jest.fn(async () => ({ diaries: [] })),
  getDayEntry: jest.fn(async () => ({})),
  setDayEntry: jest.fn(async () => ({}))
}));

jest.unstable_mockModule('../../public/js/setup/setup.page.js', () => ({
  switchPage: jest.fn(() => { })
}));

jest.unstable_mockModule('../../public/js/entry/entry.html.js', () => ({
  deploy: jest.fn(() => { })
}));

const { initPage, switchPage: entryPage } = await import('../../public/js/entry/entry.page.js');
const { getUserSettings } = await import('../../public/js/db.js');
const { switchPage: setupPage } = await import('../../public/js/setup/setup.page.js');
const { deploy: deployEntry } = await import('../../public/js/entry/entry.html.js');

describe('Entry.page', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initPage', () => {
    it('should navigates to setup page if user has no diaries', async () => {
      await initPage();
      expect(setupPage).toHaveBeenCalled();
      expect(deployEntry).not.toHaveBeenCalled();
    });

    it('should navigate to entry page if user has diaries and doc title should reflect date', async () => {
      const date = getDisplayableDate(new Date());
      getUserSettings.mockReturnValue({ diaries: ['diary'] });
      await initPage();
      expect(setupPage).not.toHaveBeenCalled();
      expect(deployEntry).toHaveBeenCalled();
      expect(global.document.title).toBe(`${date} | Lifetime Journal`);
    });
  });
});