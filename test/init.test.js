import { jest } from '@jest/globals';

jest.unstable_mockModule('../public/js/firebase.app.js', () => ({
  app: jest.fn(() => ({ type: 'app' })),
  getAuthenticateUser: jest.fn(async () => ({ type: 'user' })),
  switchToSignOutPage: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));


jest.unstable_mockModule('../public/js/db.js', () => ({
  getUserSettings: jest.fn(async () => ({ diaries: [] }))
}));

jest.unstable_mockModule('../public/js/entry/entry.controller.js', () => ({
  switchPage: jest.fn(() => ({}))
}));

jest.unstable_mockModule('../public/js/signin/signin.controller.js', () => ({
  switchPage: jest.fn(() => ({}))
}));


jest.unstable_mockModule('../public/js/utils/date-utils.js', () => ({
  getFormattedDate: jest.fn(() => ({}))
}));

jest.unstable_mockModule('../public/js/entry/entry.controller.js', () => ({
  switchPage: jest.fn(() => ({}))
}));

const { init } = await import('../public/js/init.js');
const { getAuthenticateUser, signOut } = await import('../public/js/firebase.app.js');
const { getFormattedDate } = await import('../public/js/utils/date-utils.js');
const { switchPage: switchToEntryPage } = await import('../public/js/entry/entry.controller.js');
const { switchPage: switchToSignInPage } = await import('../public/js/signin/signin.controller.js');

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
    await init('/');
    expect(switchToEntryPage).toHaveBeenCalledWith({ "type": "user" }, '2023-01-01');
  });

  it('redirects to entry page for current date if no day specified', async () => {
    getAuthenticateUser.mockResolvedValueOnce({});
    await init('/entry/');
    expect(switchToEntryPage).toHaveBeenCalledWith({ "type": "user" }, '2023-01-01');
  });

  it('redirects to entry page for specified day', async () => {
    getAuthenticateUser.mockResolvedValueOnce({});
    const params = new URLSearchParams('day=2023-01-15');
    await init('/entry/', params);
    expect(switchToEntryPage).toHaveBeenCalledWith({}, '2023-01-15');
  });

  it('signs user out and redirects to sign in', async () => {
    getAuthenticateUser.mockResolvedValueOnce({});
    signOut.mockImplementationOnce(() => { });
    await init('/signout/');
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});