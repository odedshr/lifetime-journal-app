import { jest } from '@jest/globals';
import { addToDate, getFormattedDate, getDateFromURL, getDisplayableDate, getShorthandedDayOfTheWeekName } from '../../public/js/utils/date-utils.js';

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
  })
});