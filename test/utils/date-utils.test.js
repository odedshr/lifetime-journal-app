import { jest } from '@jest/globals';
import {
  addToDate,
  getFormattedDate,
  getDateFromURL,
  getDisplayableDate,
  getMmDd,
  getShorthandedDayOfTheWeekName,
  isDateStringValid,
  isFirstDateBeforeSecondDate,
  isLeapYear
} from '../../public/js/utils/date-utils.js';

describe('date utils', () => {
  const date = new Date(2020, 0, 13);
  let languageGetter;

  beforeEach(() => {
    languageGetter = jest.spyOn(window.navigator, 'language', 'get')
  })

  describe('getFormattedDate', () => {
    it('should return a string in the format of YYYY-MM-DD', () => {
      expect(getFormattedDate(date)).toEqual('2020-01-13');
    });
  });

  describe('getDateFromURL', () => {
    it('should return a date object', () => {
      const urlSearchParamString = '?day=2020-01-13'
      expect(getDateFromURL(urlSearchParamString)).toEqual('2020-01-13');
    });

    it('should return current date if no date is provided', () => {
      const urlSearchParamString = ''
      expect(getDateFromURL(urlSearchParamString)).toEqual((new Date()).toISOString().split('T')[0]);
    });

    it('should return current date if bad input provded', () => {
      const urlSearchParamString = '?day=2020-01-13-bad-input'
      expect(getDateFromURL(urlSearchParamString)).toEqual((new Date()).toISOString().split('T')[0]);
    });
  });

  describe('getDisplayableDate', () => {
    it('should return a string in the format of DD/MM/YYYY', () => {
      languageGetter.mockReturnValue('en-GB');
      expect(getDisplayableDate(date)).toEqual('13/01/2020');
    });
  });

  describe('addToDate', () => {
    it('should return a string representing same date as input if no additional arugmen provided', () => {
      expect(addToDate(date)).toEqual(date);
    });

    it('should return a string representing the date one day after the input date', () => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      expect(addToDate(date, 1)).toEqual(nextDate);
    });
  });

  describe('getShorthandedDayOfTheWeekName', () => {
    it('should return a string representing the day of the week in English', () => {
      //mock navigator.language to UK English
      languageGetter.mockReturnValue('en-GB');
      expect(getShorthandedDayOfTheWeekName(date)).toEqual('Mon');
    });

    it('should return a string representing the day of the week in Hebrew', () => {
      //mock navigator.language to Hebrew
      languageGetter.mockReturnValue('he-IL');
      expect(getShorthandedDayOfTheWeekName(date)).toEqual('יום ב׳');
    });
  });

  describe('getMmDd', () => {
    it('should return a string in the format of MM-DD', () => {
      expect(getMmDd(date)).toEqual('01-13');
    });
  });

  describe('isDateStringValid', () => {
    it('returns false for invalid date string format', () => {
      expect(isDateStringValid('2023')).toBe(false);
      expect(isDateStringValid('2023-01')).toBe(false);
    });

    it('returns false for invalid months', () => {
      expect(isDateStringValid('2023-00-01')).toBe(false);
      expect(isDateStringValid('2023-13-01')).toBe(false);
    });

    it('returns false for invalid days', () => {
      expect(isDateStringValid('2023-01-00')).toBe(false);
      expect(isDateStringValid('2023-01-32')).toBe(false);
    });

    it('returns false for invalid dates', () => {
      expect(isDateStringValid('2023-02-29')).toBe(false); // not leap year
      expect(isDateStringValid('2024-02-30')).toBe(false); // feb doesn't have 30 days
    });

    it('returns true for valid date strings', () => {
      expect(isDateStringValid('2023-01-01')).toBe(true);
      expect(isDateStringValid('2020-02-29')).toBe(true); // leap year
    });
  });

  describe('isFirstDateBeforeSecondDate', () => {
    it('returns true for future dates', () => {
      const now = new Date(2023, 10, 1);
      const futureDate = new Date(2100, 1, 1);
      expect(isFirstDateBeforeSecondDate(now, futureDate)).toBe(true);
    });

    it('returns false for past dates', () => {
      const now = new Date(2023, 10, 1);
      const pastDate = new Date(1900, 1, 1);
      expect(isFirstDateBeforeSecondDate(now, pastDate)).toBe(false);
    });
  });

  describe('isLeapYear', () => {
    it('returns true for leap years', () => {
      expect(isLeapYear(new Date(2020, 0, 1))).toBe(true);
    });

    it('returns false for non-leap years', () => {
      expect(isLeapYear(new Date(2021, 0, 1))).toBe(false);
    });
  });
});