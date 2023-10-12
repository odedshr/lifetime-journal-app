import { jest } from '@jest/globals';

jest.unstable_mockModule('../../public/js/firebase.app.js', () => ({
  signIn: jest.fn()
}));

jest.unstable_mockModule('../../public/js/init.js', () => ({
  init: jest.fn()
}));

jest.unstable_mockModule('../../public/js/signin/signin.html.js', () => ({
  appendChild: jest.fn()
}));

const { signIn } = await import('../../public/js/firebase.app.js');
const { init } = await import('../../public/js/init.js');

const { appendChild } = await import('../../public/js/signin/signin.html.js');
const { onSignInButtonClicked, switchPage } = await import('../../public/js/signin/signin.controller.js');

describe('signin controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('switchPage', () => {

    it('sets document title', () => {
      switchPage();

      expect(document.title).toBe('Sign in | Lifetime Journal');
    });

    it('appends sign in button', () => {
      switchPage();

      expect(appendChild).toHaveBeenCalledWith(
        document.body,
        expect.objectContaining({
          onSignInButtonClicked: expect.any(Function)
        })
      );
    });

    it('it initialises the app when SignInButton is clicked', async () => {
      signIn.mockResolvedValueOnce(true);
      switchPage();

      await appendChild.mock.calls[0][1].onSignInButtonClicked();
      expect(signIn).toHaveBeenCalled();
      expect(init).toHaveBeenCalled();
    });
  });
});