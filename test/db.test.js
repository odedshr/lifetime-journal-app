import { jest } from '@jest/globals';

jest.unstable_mockModule('@firebase/firestore', () => ({
  addDoc: jest.fn(),
  connectAuthEmulator: jest.fn(),
  connectFirestoreEmulator: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getFirestore: jest.fn(),
  setDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  writeBatch: jest.fn(() => ({ set: () => { }, commit: () => { } })),
  Timestamp: { fromDate: jest.fn((date) => (date)) }
}));

const { addDoc, getFirestore, doc, collection, getDoc, getDocs, setDoc, deleteDoc, writeBatch } = await import('@firebase/firestore');
const {
  getUserSettings,
  saveUserSettings,
  getDayEntry,
  setDayEntry,
  getDiary,
  getDiaryContent,
  setDiaryContent,
  deleteDiaryContent,
  getAnnuals,
  setAnnuals,
  getPeriods,
  getPeriod,
  setPeriod,
  DEFAULT_DIARY
} = await import('../public/js/db.js');

describe('DB utils', () => {
  const docReference = { id: 'docId' };
  const entry = {
    date: '2021-01-01',
    mood: 'happy',
    thoughts: 'I am feeling great!'
  };
  const events = [{ label: 'ev1' }, { label: 'ev2' }, { label: 'ev3' }];

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
      user = {};

      // when
      const settings = getUserSettings(app, user);

      //then
      await expect(settings).rejects.toThrowError('User must have email');

    });

    it('should return an diary list with default diary if settings object doesn\'t exists', async () => {
      // given
      const expectedSettings = { currentDiaryIndex: 0, diaries: [DEFAULT_DIARY] };

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
      global.console.error = jest.fn();
      setDoc.mockRejectedValue(new Error('setDoc failed'));

      await expect(setDayEntry(app, user, 'diary', '2021-01-01', entry)).rejects.toThrowError("setDoc failed");

      expect(setDoc).toHaveBeenCalledTimes(1);
      expect(global.console.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAnnuals', () => {
    it('should get day annuals', async () => {

      getDoc.mockResolvedValue({
        data: () => ({ events }),
        exists: () => true
      });

      const result = await getAnnuals(app, user, 'diary', new Date('2000-01-10'));

      expect(getDoc).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ "annuals": events, "leapYear": [] });
    });

    it('should return empty array if day entry doesn\'t exists', async () => {
      getDoc.mockResolvedValue({
        data: () => null,
        exists: () => false
      });

      const result = await getAnnuals(app, user, 'diary', new Date('2000-01-10'));

      expect(getDoc).toHaveBeenCalledTimes(1);
      expect(getDoc).toHaveBeenCalledWith(docReference);
      expect(result).toEqual({ "annuals": [], "leapYear": [] });
    });

    it('should get day annuals including leap year', async () => {

      getDoc.mockResolvedValue({
        data: () => ({ events }),
        exists: () => true
      });

      const result = await getAnnuals(app, user, 'diary', new Date('2001-02-28'));

      expect(getDoc).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ "annuals": events, "leapYear": events.map(ev => ({ ...ev, label: `${ev.label} (Feb 29)` })) });
    });
  });

  describe('setDayAnnauls', () => {
    it('should set day annuals', async () => {
      const result = await setAnnuals(app, user, 'diary', '01-01', events);

      // then
      expect(setDoc).toHaveBeenCalledTimes(1);
      expect(setDoc).toHaveBeenCalledWith(docReference, { events });
      expect(result).toEqual(true);
    });

    it('should return false if setDoc fails', async () => {
      global.console.error = jest.fn();
      setDoc.mockRejectedValue(new Error('setDoc failed'));

      await expect(setAnnuals(app, user, 'diary', '01-01', events)).rejects.toThrowError("setDoc failed");

      expect(setDoc).toHaveBeenCalledTimes(1);
      expect(global.console.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDiary', () => {
    it('should get period', async () => {
      const expectedSettings = { currentDiaryIndex: 0, diaries: [DEFAULT_DIARY] };
      const expectedResult = { exists: () => true, data: () => expectedSettings };

      getDoc.mockResolvedValue(expectedResult);

      const result = await getDiary(app, user);

      expect(getDoc).toHaveBeenCalledTimes(1);
      expect(result).toEqual(DEFAULT_DIARY);
    });
  });

  describe('getDiaryContent', () => {
    it("should get diary content", async () => {
      const data = { a: "aa", b: "bb" };
      const expectedResult = { docs: [{ id: "a", data: () => "aa" }, { id: "b", data: () => "bb" }] };

      getDocs.mockResolvedValue(expectedResult);

      const result = await getDiaryContent(app, user, "diary-01");

      expect(getDocs).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ "entries": data, "annuals": data, "periods": data, "settings": "diary-01" });
    });
  });

  describe('setDiaryContent', () => {
    it("should add new diary", async () => {
      const diaryContent = {
        settings: { uri: "diary-01" },
        entries: [{ a: "aa" }],
        annuals: [{ b: "bb" }],
        periods: [{ c: "cc" }]
      };

      const result = await setDiaryContent(app, user, { diaries: [] }, diaryContent, "replace");

      expect(writeBatch).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ "diaries": [{ uri: "diary-01" }] });
    });

    it("should replace diary content", async () => {
      const diaryContent = { settings: { uri: "diary-01" }, entries: [], annuals: [], periods: [] };

      const result = await setDiaryContent(app, user, { diaries: [{ uri: "diary-01", name: "old" }] }, diaryContent, "replace");

      expect(writeBatch).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ "diaries": [{ uri: "diary-01" }] });
    });

    it("should merge diary content", async () => {
      const diaryContent = { settings: { uri: "diary-01" }, entries: [], annuals: [], periods: [] };

      const result = await setDiaryContent(app, user, { diaries: [{ uri: "diary-01", name: "old" }] }, diaryContent, "merge");

      expect(writeBatch).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ "diaries": [{ "uri": "diary-01", "name": "old" }] });
    });
  });

  describe('deleteDiaryContent', () => {
    it("should delete the diary", () => {
      deleteDiaryContent(app, user, "diary-uri");
      expect(deleteDoc).toHaveBeenCalledTimes(1);
    })
  });

  describe('getPeriods', () => {
    it('should get day periods', async () => {
      const date = new Date('2000-01-10');
      const timestamp = { toDate: () => date };
      const expectedResult = { docs: [{ id: 'period-id', data: () => ({ type: 'period', startDate: timestamp, endDate: timestamp }) }] };
      getDocs.mockResolvedValue(expectedResult);

      const result = await getPeriods(app, user, 'diary', date);

      expect(getDocs).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ "id": "period-id", "type": "period", "startDate": date, "endDate": date }]);
    });

    it('should filter expired events', async () => {
      const startDate = { toDate: () => new Date('2000-01-01') };
      const expectedResult = {
        docs: [
          { id: 'period-1', data: () => ({ label: 'a', startDate, endDate: { toDate: () => new Date('2000-01-01') } }) },
          { id: 'period-2', data: () => ({ label: 'b', startDate, endDate: { toDate: () => new Date('2000-01-10') } }) }]
      };
      getDocs.mockResolvedValue(expectedResult);

      const result = await getPeriods(app, user, 'diary', new Date('2000-01-05'));

      expect(getDocs).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ "id": "period-2", "label": "b", "startDate": new Date('2000-01-01'), "endDate": new Date('2000-01-10') }]);
    });
  });

  describe('getPeriod', () => {
    it('should get period', async () => {
      const expectedResult = { exists: () => true, data: () => ({ type: 'period' }) };

      getDoc.mockResolvedValue(expectedResult);

      const result = await getPeriod(app, user, 'diary', "my-id");

      expect(getDoc).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ type: 'period' });
    });

    it('should return null if not found', async () => {
      const expectedResult = { exists: () => false, data: () => ({ type: 'period' }) };

      getDoc.mockResolvedValue(expectedResult);

      const result = await getPeriod(app, user, 'diary', "my-id");

      expect(getDoc).toHaveBeenCalledTimes(1);
      expect(result).toEqual(null);
    });
  });

  describe('setPeriod', () => {
    const period = {
      id: 'docId',
      startDate: new Date('2000-01-01'),
      endDate: new Date('2000-01-10'),
      color: '#000000',
      label: 'label'
    };

    it('should set a period', async () => {
      const result = await setPeriod(app, user, 'diary', period.id, period);

      expect(setDoc).toHaveBeenCalledTimes(1);
      expect(setDoc).toHaveBeenCalledWith(docReference, period);
      expect(result).toEqual(true);
    });

    it('should add a period', async () => {
      const result = await setPeriod(app, user, 'diary', undefined, period);

      expect(addDoc).toHaveBeenCalledTimes(1);
      expect(addDoc).toHaveBeenCalledWith(undefined, period);
      expect(result).toEqual(true);
    });

    it('should return false if setDoc fails', async () => {
      global.console.error = jest.fn();
      setDoc.mockRejectedValue(new Error('setDoc failed'));

      await expect(setPeriod(app, user, 'diary', period.id, period)).rejects.toThrowError("setDoc failed");

      expect(setDoc).toHaveBeenCalledTimes(1);
      expect(global.console.error).toHaveBeenCalledTimes(1);
      expect(setDoc).toHaveBeenCalledWith(docReference, period);
    });

    it('should delete a period', async () => {
      const result = await setPeriod(app, user, 'diary', period.id, null);

      expect(deleteDoc).toHaveBeenCalledTimes(1);
      expect(deleteDoc).toHaveBeenCalledWith(docReference);
      expect(result).toEqual(true);
    });

    it('should return false if failed to save', async () => {
      await expect(setPeriod(app, user, 'diary', undefined, null)).rejects.toThrowError("missing input: period");
    });
  });
});