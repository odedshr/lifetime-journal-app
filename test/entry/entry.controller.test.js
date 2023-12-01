import { jest } from '@jest/globals';

jest.unstable_mockModule('../../public/js/firebase.app.js', () => ({
  app: jest.fn(() => ({ type: 'app' })),
  getAuthenticateUser: jest.fn(async () => ({ type: 'user' })),
  switchToSignOutPage: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.unstable_mockModule('../../public/js/init.js', () => ({
  redirectTo: jest.fn(() => { })
}));

jest.unstable_mockModule('../../public/js/db.js', () => ({
  getDiary: jest.fn(() => ({ uri: 'diary-01' })),
  getDefaultFields: jest.fn(() => ({})),
  getDayEntry: jest.fn(async () => ({})),
  setDayEntry: jest.fn(async () => ({})),
  getAnnuals: jest.fn(async () => ({})),
  setAnnuals: jest.fn(async () => ({})),
  getPeriods: jest.fn(async () => ({})),
  setPeriod: jest.fn(async () => true)
}));

let inputs;
jest.unstable_mockModule('../../public/js/entry/entry.html.js', () => ({
  appendChild: jest.fn(async (parent, props) => { inputs = props; })
}));

jest.unstable_mockModule('../../public/js/utils/date-utils.js', () => ({
  getDisplayableDate: jest.fn(() => ('xxx')),
  getFormattedDate: jest.fn(() => ('yyyy-mm-dd')),
  getShorthandedDayOfTheWeekName: jest.fn(),
  addToDate: jest.fn(),
  getMmDd: jest.fn(),
  isDateStringValid: jest.fn(),
  getMmDdFromString: jest.fn(),
  isFirstDateBeforeSecondDate: jest.fn(),
  LEAP_YEAR_MONTH_LENGTH: [],
  MONTH_NAMES: []
}));

const { app } = await import('../../public/js/firebase.app.js');
const { switchPage } = await import('../../public/js/entry/entry.controller.js');
const { getDiary, getPeriods, setPeriod } = await import('../../public/js/db.js');
const { appendChild } = await import('../../public/js/entry/entry.html.js');
const { getDayEntry } = await import('../../public/js/db.js');
const { redirectTo } = await import('../../public/js/init.js');
const { setDayEntry } = await import('../../public/js/db.js');

describe('Entry.Controller', () => {

  describe('switchPage', () => {

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('sets page title', async () => {
      await switchPage({}, '2023-01-13');
      expect(document.title).toEqual('xxx | Lifetime Journal');
    });

    it('gets current diary', async () => {
      await switchPage({}, '2023-01-01');
      expect(getDiary).toHaveBeenCalledWith(
        expect.any(Function), {});
    });

    it('gets entry for default diary if none configured', async () => {
      getDiary.mockResolvedValueOnce({ uri: "custom1" });
      await switchPage({}, '2023-01-01');
      expect(getDayEntry).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
        { "uri": "custom1" },
        '2023-01-01'
      );
    });

    it('gets entry for configured diary', async () => {
      getDiary.mockResolvedValueOnce({ "uri": "custom2" });
      await switchPage({}, '2023-01-01');
      expect(getDayEntry).toHaveBeenCalledWith(
        expect.any(Function),
        {},
        { "uri": "custom2" },
        '2023-01-01'
      );
    });

    it('appends page content', async () => {
      await switchPage({}, '2023-01-01');
      expect(appendChild).toHaveBeenCalled();
    });

    it('calls redirectTo when onDayChanged', async () => {
      await switchPage({}, '2023-01-01');
      inputs.onDayChanged('a', 'b');
      expect(redirectTo).toHaveBeenCalledWith('/entry/', new URLSearchParams('?day=a'));
    });

    it('calls redirect when onAnnualEditRequest', async () => {
      await switchPage({}, '2023-01-01');
      inputs.onAnnualEditRequest('a', 'b', 'c');
      expect(redirectTo).toHaveBeenCalledWith('/annuals/', new URLSearchParams('?id=a&day=2023-01-01'));
    });

    it('calls setDayEntry when onEntryChanged', async () => {
      await switchPage('user', '2023-01-01');
      inputs.onEntryChanged({ date: 'a' }, 'b', { uri: 'c' }, 'd', 'a');
      expect(setDayEntry).toHaveBeenCalledWith(app, 'user', 'diary-01', 'a', { date: 'a' });
    });

    it('throws error when failing to write period', async () => {
      const error = new Error('write failed');
      setPeriod.mockRejectedValue(error);

      await switchPage({}, '2023-01-01');
      const result = await inputs.onPeriodChanged('a', 'b');
      expect(result).toEqual(error);
    });

    it('set periods to db', async () => {
      await switchPage({}, '2023-01-01');
      inputs.onPeriodChanged('a', 'b');
      expect(setPeriod).toHaveBeenCalled();
      expect(getPeriods).toHaveBeenCalled();
    });
  });
});