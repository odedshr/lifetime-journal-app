import { jest } from '@jest/globals';

jest.unstable_mockModule('../public/js/firebase.app.js', () => ({
  app: jest.fn(() => ({ type: 'app' })),
  getAuthenticateUser: jest.fn(async () => ({ type: 'user' })),
  switchToSignOutPage: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));


jest.unstable_mockModule('../public/js/db.js', () => ({
  getUserSettings: jest.fn(async () => ({ diaries: [] })),
  getDayAnnuals: jest.fn(),
  setDayAnnuals: jest.fn()
}));

const mockedController = () => ({
  switchPage: jest.fn(() => ({}))
});

jest.unstable_mockModule('../public/js/annuals/annuals.controller.js', mockedController);

jest.unstable_mockModule('../public/js/entry/entry.controller.js', mockedController);

jest.unstable_mockModule('../public/js/signin/signin.controller.js', mockedController);

jest.unstable_mockModule('../public/js/404/404.controller.js', mockedController);

jest.unstable_mockModule('../public/js/utils/date-utils.js', () => ({
  getFormattedDate: jest.fn(() => ({})),
  addToDate: jest.fn(),
  getShorthandedDayOfTheWeekName: jest.fn(),
  getMmDd: jest.fn(),
  isDateStringValid: jest.fn(() => true),
  LEAP_YEAR_MONTH_LENGTH: [],
  MONTH_NAMES: []
}));

const { init } = await import('../public/js/init.js');
const { getAuthenticateUser, signOut } = await import('../public/js/firebase.app.js');
const { getFormattedDate, isDateStringValid } = await import('../public/js/utils/date-utils.js');
const { switchPage: switchToAnnualsPage } = await import('../public/js/annuals/annuals.controller.js');
const { switchPage: switchToEntryPage } = await import('../public/js/entry/entry.controller.js');
const { switchPage: switchToSignInPage } = await import('../public/js/signin/signin.controller.js');
const { switchPage: switchToPageNotFound } = await import('../public/js/404/404.controller.js');

describe('Init', () => {

  beforeEach(() => {
    getFormattedDate.mockReturnValue('2023-01-01');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to entry when user enters overview page', async () => {
    getAuthenticateUser.mockRejectedValueOnce();
    await init('/')
    expect(switchToSignInPage).toHaveBeenCalledTimes(1);
  });

  it('redirects to entry page if no url specified', async () => {
    getAuthenticateUser.mockResolvedValueOnce({});
    isDateStringValid.mockReturnValueOnce(false);
    await init('/');
    expect(switchToEntryPage).toHaveBeenCalledWith({ "type": "user" }, '2023-01-01');
  });

  it('redirects to entry page for current date if no day specified', async () => {
    getAuthenticateUser.mockResolvedValueOnce({ "type": "user" });
    isDateStringValid.mockReturnValueOnce(false);
    await init('/entry/');
    expect(switchToEntryPage).toHaveBeenCalledWith({ "type": "user" }, '2023-01-01');
  });

  it('redirects to entry page for specified day', async () => {
    getAuthenticateUser.mockResolvedValueOnce({});
    const params = new URLSearchParams('day=2023-01-15');
    await init('/entry/', params);
    expect(switchToEntryPage).toHaveBeenCalledWith({}, '2023-01-15');
  });

  it('redirects to annuals page for current date if no day specified', async () => {
    getAuthenticateUser.mockResolvedValueOnce({ "type": "user" });
    isDateStringValid.mockReturnValueOnce(false);
    await init('/annuals/');
    expect(switchToAnnualsPage).toHaveBeenCalledWith({ "type": "user" }, '2023-01-01', undefined);
  });

  it('redirects to annuals page for specified day', async () => {
    getAuthenticateUser.mockResolvedValueOnce({ "type": "user" });
    const params = new URLSearchParams('day=2023-01-15');
    await init('/annuals/', params);
    expect(switchToAnnualsPage).toHaveBeenCalledWith({ "type": "user" }, '2023-01-15', undefined);
  });

  it('redirects to annuals page for specified day and item', async () => {
    getAuthenticateUser.mockResolvedValueOnce({ "type": "user" });
    const params = new URLSearchParams('day=2023-01-15&id=1');
    await init('/annuals/', params);
    expect(switchToAnnualsPage).toHaveBeenCalledWith({ "type": "user" }, '2023-01-15', 1);
  });

  it('signs user out and redirects to sign in', async () => {
    getAuthenticateUser.mockResolvedValueOnce({});
    signOut.mockImplementationOnce(() => { });
    await init('/signout/');
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('redirects to page not found if url not recognized', async () => {
    getAuthenticateUser.mockResolvedValueOnce({});
    await init('/not-found/');
    expect(switchToPageNotFound).toHaveBeenCalledTimes(1);
  });
});