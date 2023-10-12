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
  setDayEntry: jest.fn(async () => ({})),
  getDayAnnuals: jest.fn(async () => ({ annuals: [{ label: 'a' }, { label: 'b' }, { label: 'c' }], leapYear: [] })),
  setDayAnnuals: jest.fn(async () => ({}))
}));

jest.unstable_mockModule('../../public/js/init.js', () => ({
  redirectTo: jest.fn(() => ({})),
}));

let props = [];
jest.unstable_mockModule('../../public/js/annuals/annuals.html.js', () => ({
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
const { switchPage } = await import('../../public/js/annuals/annuals.controller.js');
const { getUserSettings, getDayAnnuals, setDayAnnuals } = await import('../../public/js/db.js');
const { appendChild } = await import('../../public/js/annuals/annuals.html.js');
const { redirectTo } = await import('../../public/js/init.js');

describe('Annuals.Controller', () => {

  describe('switchPage', () => {

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('sets page title', async () => {
      await switchPage({}, '2023-01-13');
      expect(document.title).toEqual('mm/dd(2023-01-13) | Lifetime Journal');
    });

    it('gets user settings', async () => {
      await switchPage({}, '2023-01-01');
      expect(getUserSettings).toHaveBeenCalledWith(
        expect.any(Function), {});
    });

    it('gets annuals for configured diary', async () => {
      getUserSettings.mockResolvedValueOnce({
        diaries: [{ "uri": "custom" }]
      });
      await switchPage({}, '2023-01-01');
      expect(getDayAnnuals).toHaveBeenCalledWith(
        expect.any(Function),
        {},
        { "uri": "custom" },
        new Date('2023-01-01')
      );
    });

    it('appends page content', async () => {
      await switchPage({}, '2023-01-01');
      expect(appendChild).toHaveBeenCalled();
    });

    it('onDayChanged redirects page', async () => {
      await switchPage({}, '2023-01-01', 1);
      props[4]('yyyy-mm-dd');
      expect(redirectTo).toHaveBeenCalledWith('/annuals/', new URLSearchParams('?day=yyyy-mm-dd&diary=diary-01'));
    });

    it('onAnnualChanged sets new annual', async () => {
      await switchPage({}, '2023-01-01', 1);
      const result = await props[5]([{ label: 'new' }]);
      expect(setDayAnnuals).toHaveBeenCalledWith(app, {}, "diary-01", "mm/dd(2023-01-01)", [{ "label": "new" }]);
      expect(result).toEqual(true);
    });

    it('onAnnualChanged fails to set new annual', async () => {
      setDayAnnuals.mockResolvedValueOnce(false);
      await switchPage({}, '2023-01-01', 1);
      const result = await props[5]([{ label: 'new' }]);
      expect(setDayAnnuals).toHaveBeenCalledWith(app, {}, "diary-01", "mm/dd(2023-01-01)", [{ "label": "new" }]);
      expect(result).toEqual(false);
    });

    it('onAnnualEditRequest redirects to new id', async () => {
      await switchPage({}, '2023-01-01', 1);
      props[6](99);
      expect(redirectTo).toHaveBeenCalled();
    });

    it('onDeleteAnnualRequested sets new manual', async () => {
      await switchPage({}, '2023-01-01', 1);
      props[7](1);
      expect(setDayAnnuals).toHaveBeenCalledWith(app, {}, "diary-01", "mm/dd(2023-01-01)", [{ label: 'a' }, { label: 'c' }]);
    });
  });
});