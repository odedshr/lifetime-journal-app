import { getFormattedDate, getDateFromURL, getDisplayableDate, addToDate } from '../../public/js/utils/date-utils.js';

describe('date utils', () => {
  const date = new Date(2020, 0, 13);

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
    it('should return a string in the format of MM/DD/YYYY', () => {
      expect(navigator.language).toEqual('en-US');
      expect(getDisplayableDate(date)).toEqual('1/13/2020');
    });
  });

  describe('addToDate', () => {
    it('should return a string representing same date as input if no additional arugmen provided', () => {
      expect(addToDate('2020-01-13')).toEqual('2020-01-13');
    });

    it('should return a string representing the date one day after the input date', () => {
      expect(addToDate('2020-01-13', 1)).toEqual('2020-01-14');
    });
  });
});