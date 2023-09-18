import { jest } from '@jest/globals';

jest.unstable_mockModule('@firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getFirestore: jest.fn(),
  setDoc: jest.fn()
}));

const { getFirestore, doc, collection, getDoc, setDoc } = await import('@firebase/firestore');
const {
  getUserSettings,
  saveUserSettings,
  getDayEntry,
  setDayEntry
} = await import('../public/js/db.js');

describe('DB utils', () => {
  const docReference = { id: 'docId' };
  const entry = {
    date: '2021-01-01',
    mood: 'happy',
    thoughts: 'I am feeling great!'
  };

  let app;
  let user;
  let db;

  beforeEach(() => {
    app = {};
    user = { email: 'email@foo.bar' };
    db = {};

    getFirestore.mockReturnValue(db);
    doc.mockReturnValue(docReference);
    getDoc.mockResolvedValue(() => { });
    setDoc.mockResolvedValue(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserSettings', () => {
    it('should get user settings doc', async () => {
      // given
      const expectedSettings = { diaries: ['personal'] };
      getDoc.mockResolvedValue({
        data: () => expectedSettings,
        exists: () => true
      });

      // when
      const settings = await getUserSettings(app, user);

      //then
      expect(collection).toHaveBeenCalledWith(app, "email@foo-bar");
      expect(getDoc).toHaveBeenCalledTimes(1);
      expect(settings).toEqual(expectedSettings);
    });

    it('should throw error if user does not have email property', async () => {
      // given
      const expectedSettings = { diaries: ['personal'] };
      user = {};

      // when
      const settings = getUserSettings(app, user);

      //then
      await expect(settings).rejects.toThrowError('User must have email');

    });

    it('should return an empty diary list of settings object doesn\'t exists', async () => {
      // given
      const expectedSettings = { diaries: [] };

      getDoc.mockResolvedValue({
        data: () => null,
        exists: () => false
      });

      // when
      const settings = await getUserSettings(app, user);

      //then
      expect(getDoc).toHaveBeenCalledTimes(1);
      expect(settings).toEqual(expectedSettings);
    });
  });

  describe('setUserSettings', () => {
    it('should save user settings doc', async () => {
      const settings = { diaries: ['personal'] };

      await saveUserSettings(app, user, settings);

      expect(setDoc).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDayEntry', () => {
    it('should get day entry', async () => {

      getDoc.mockResolvedValue({
        data: () => entry,
        exists: () => true
      });

      const result = await getDayEntry(app, user, 'diary', '2021-01-01');

      expect(getDoc).toHaveBeenCalledTimes(1);
      expect(result).toEqual(entry);
    });

    it('should return default entry if day entry doesn\'t exists', async () => {
      const defaultEntry = { "date": '2021-01-01', "fields": [{ "type": "text", "value": "" }] };

      getDoc.mockResolvedValue({
        data: () => null,
        exists: () => false
      });

      const result = await getDayEntry(app, user, 'diary', '2021-01-01');

      expect(getDoc).toHaveBeenCalledTimes(1);
      expect(getDoc).toHaveBeenCalledWith(docReference);
      expect(result).toEqual(defaultEntry);
    });
  });

  describe('setDayEntry', () => {
    it('should set day entry', async () => {
      const result = await setDayEntry(app, user, 'diary', '2021-01-01', entry);

      // then
      expect(setDoc).toHaveBeenCalledTimes(1);
      expect(setDoc).toHaveBeenCalledWith(docReference, entry);
      expect(result).toEqual(true);
    });

    it('should return false if setDoc fails', async () => {
      setDoc.mockRejectedValue(new Error('setDoc failed'));

      const result = await setDayEntry(app, user, 'diary', '2021-01-01', entry);

      expect(setDoc).toHaveBeenCalledTimes(1);
      expect(setDoc).toHaveBeenCalledWith(docReference, entry);
      expect(result).toEqual(false);
    });
  });
});