import { jest } from '@jest/globals';

jest.unstable_mockModule('../public/js/firebase.app.js', () => ({
  app: jest.fn(() => ({ type: 'app' })),
  getAuthenticateUser: jest.fn(async () => ({ type: 'user' })),
  switchToSignOutPage: jest.fn()
}));


jest.unstable_mockModule('../public/js/db.js', () => ({
  getUserSettings: jest.fn(async () => ({ diaries: [] }))
}));

jest.unstable_mockModule('../public/js/setup/setup.page.js', () => ({
  switchPage: jest.fn(() => { })
}));

jest.unstable_mockModule('../public/js/entry/entry.page.js', () => ({
  switchPage: jest.fn(() => ({}))
}));

const { initPage } = await import('../public/js/main.page.js');
const { getUserSettings } = await import('../public/js/db.js');
const { switchPage: entryPage } = await import('../public/js/entry/entry.page.js');
const { switchPage: setupPage } = await import('../public/js/setup/setup.page.js');

describe('Main.page', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initPage', () => {
    it('should navigates to setup page if user has no diaries', async () => {
      await initPage();
      expect(setupPage).toHaveBeenCalled();
      expect(entryPage).not.toHaveBeenCalled();
    });

    it('should navigate to entry page if user has diaries', async () => {
      getUserSettings.mockReturnValue({ diaries: ['diary'] });
      await initPage();
      expect(setupPage).not.toHaveBeenCalled();
      expect(entryPage).toHaveBeenCalled();
    });
  });
});