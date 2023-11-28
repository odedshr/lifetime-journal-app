import { jest } from '@jest/globals';

jest.unstable_mockModule('../../public/js/firebase.app.js', () => ({
  app: jest.fn(() => ({ type: 'app' })),
  getAuthenticateUser: jest.fn(async () => ({ type: 'user' })),
  switchToSignOutPage: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));


jest.unstable_mockModule('../../public/js/db.js', () => ({
  getDiary: jest.fn(async () => ({ uri: 'diary-01' })),
  getUserSettings: jest.fn(async () => ({ diaries: [] })),
  getDayEntry: jest.fn(async () => ({})),
  setDayEntry: jest.fn(async () => ({})),
  getPeriods: jest.fn(async () => ([{ label: 'a' }, { label: 'b' }, { label: 'c' }])),
  setPeriod: jest.fn(async () => ({}))
}));

jest.unstable_mockModule('../../public/js/init.js', () => ({
  redirectTo: jest.fn(() => ({})),
}));

let props = [];
jest.unstable_mockModule('../../public/js/periods/periods.html.js', () => ({
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
const { switchPage } = await import('../../public/js/periods/periods.controller.js');
const { getDiary, getPeriods, setPeriod } = await import('../../public/js/db.js');
const { appendChild } = await import('../../public/js/periods/periods.html.js');
const { redirectTo } = await import('../../public/js/init.js');

describe('Periods.Controller', () => {

  describe('switchPage', () => {

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('sets page title', async () => {
      await switchPage({}, '2023-01-13');
      expect(document.title).toEqual('xxx | Periods | Lifetime Journal');
    });

    it('gets current diary', async () => {
      await switchPage({}, '2023-01-01');
      expect(getDiary).toHaveBeenCalledWith(
        expect.any(Function), {});
    });

    it('gets periods for configured diary', async () => {
      getDiary.mockResolvedValueOnce({ "uri": "diary-01" });
      await switchPage({}, '2023-01-01');
      expect(getPeriods).toHaveBeenCalledWith(
        expect.any(Function),
        {},
        { "uri": "diary-01" },
        new Date('2023-01-01')
      );
    });

    it('appends page content', async () => {
      await switchPage({}, '2023-01-01');
      expect(appendChild).toHaveBeenCalled();
    });

    it('onDayChanged redirects page', async () => {
      await switchPage({}, '2023-01-01', 1);
      props[3]('yyyy-mm-dd');
      expect(redirectTo).toHaveBeenCalledWith('/periods/', new URLSearchParams('?day=yyyy-mm-dd'));
    });

    it('onPeriodChanged sets new period', async () => {
      await switchPage({}, '2023-01-01', "aaa");
      const result = await props[4]({ id: "bbb", label: 'new' });
      expect(setPeriod).toHaveBeenCalledWith(app, {}, "diary-01", "bbb", { "id": "bbb", "label": "new" });
      expect(result).toEqual(true);
    });

    it('onPeriodChanged fails to set new period', async () => {
      setPeriod.mockResolvedValueOnce(false);
      await switchPage({}, '2023-01-01', "aaa");
      const result = await props[4]({ id: "bbb", label: 'new' });
      expect(setPeriod).toHaveBeenCalledWith(app, {}, "diary-01", "bbb", { "id": "bbb", "label": "new" });
      expect(result).toEqual(false);
    });

    it('onPeriodEditRequest redirects to new id', async () => {
      await switchPage({}, '2023-01-01', 1);
      props[5](99);
      expect(redirectTo).toHaveBeenCalled();
    });

    it('onDeletePeriodRequested sets new period', async () => {
      await switchPage({}, '2023-01-01', 'aaa');
      props[6]('aaa');
      expect(setPeriod).toHaveBeenCalledWith(app, {}, "diary-01", "aaa", null);
    });
  });
});