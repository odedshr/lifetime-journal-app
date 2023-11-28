import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const jsdom = await import('jsdom');

jest.unstable_mockModule('@firebase/app', () => ({
  initializeApp: jest.fn(() => ({ type: 'app' }))
}));

const mockedAuth = { type: 'auth', currentUser: { email: 'user-email' } }
jest.unstable_mockModule('@firebase/auth', () => {
  const authInstance = {
    // while handshaking with the Firebase Auth servers, currentUser
    // is null, regardless if someone is logged in or not.
    currentUser: null
  };

  const mockedUserInfo = Object.freeze({ // force read-only
    // mocked user info here - display name, email, etc
    email: 'example@example.com'
  });

  // container for attached callbacks and state variables
  const callbacks = [];
  let authCurrentUserInfo = mockedUserInfo;
  let authTimer = null;
  let authTimerCompleted = false;

  // invoke all callbacks with current data
  const fireOnChangeCallbacks = () => {
    authMock.currentUser = authCurrentUserInfo;
    callbacks.forEach((cb) => {
      try {
        cb(mockedUserInfo); // invoke any active listeners
      } catch (err) {
        console.error('Error invoking callback', err);
      }
    });
    authTimerCompleted = true;
  };

  authInstance.signOut = () => { // signInWithX will look similar to this
    authCurrentUserInfo = null;
    fireOnChangeCallbacks();
  };

  return {
    connectAuthEmulator: jest.fn(),
    getAuth: jest.fn(() => authInstance),
    GoogleAuthProvider: jest.fn(() => ({
      addScope: () => jest.fn()
    })),
    signInWithPopup: jest.fn((auth, provider) => new Promise((resolve, reject) => resolve(true))),
    onAuthStateChanged: jest.fn((authMock, onChangeCallback) => {
      setTimeout(() => onChangeCallback(getAuth()), 0);
    }),
    signOut: jest.fn()
  };
});

jest.unstable_mockModule('@firebase/analytics', () => ({
  getAnalytics: jest.fn()
}));

const { initializeApp } = await import('@firebase/app');
const { getAuth, signOut: signOutFromFirebase, signInWithPopup } = await import('@firebase/auth');

const { app, auth, user, getAuthenticateUser, signOut, signIn } = await import('../public/js/firebase.app.js');

describe('firebase.app.js', () => {
  beforeEach(() => {
    initializeApp.mockReturnValue({ type: 'app' });
    getAuth.mockReturnValue({ type: 'auth' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('app', () => {
    it('should be defined', async () => {
      expect(app).toBeDefined();
      expect(app.type).toBe('app');
    });
  });

  describe('auth', () => {
    it('should be defined', async () => {
      expect(auth).toBeDefined();
      expect(auth.currentUser).toBe(null);
      expect(auth.signOut).toBeDefined();
    });
  });

  describe('getAuthenticateUser', () => {
    it('should call callback when user is authenticated', async () => {
      const user = { type: 'user' };
      getAuth.mockReturnValue(user);
      const result = await getAuthenticateUser();
      expect(result).toEqual(user);
    });

    it('should throw exception when user is not authenticated', async () => {
      getAuth.mockReturnValue(null);
      // offical way to test throw didn't work:
      // await expect(getAuthenticateUser()).rejects.toThrow('user not authenticated');
      const result = await getAuthenticateUser().catch(err => {
        expect(err).toBe('user not authenticated');
        return true;
      });
      expect(result).toEqual(true);
    });
  });

  describe('signOut', () => {
    it('should sign out of firebase', async () => {
      await signOut();
      expect(signOutFromFirebase).toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should return true if sign in successful', async () => {
      getAuth.mockReturnValue(mockedAuth);

      const result = await signIn();
      expect(result).toEqual(true);
      expect(signInWithPopup).toHaveBeenCalled();
    });
  });
});