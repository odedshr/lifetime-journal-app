import { jest } from '@jest/globals';

jest.useFakeTimers();

const { appendChild } = await import('../../public/js/entry/entry.html.js');

describe('Entry.html', () => {
  describe('appendChild', () => {
    it('should call render with the correct props', () => {
      const parent = document.createElement('div');
      const date = '2020-01-13';
      appendChild(parent, {
        date,
        entry: { date, fields: [{ type: 'text', value: 'foo' }] },
        annuals: [],
        leapYearAnnuals: [],
        periods: [],
        onDayChanged: (date => { }),
        onEntryChanged: (entry => { }),
        onAnnualEditRequest: (date => { }),
        onPeriodChanged: (date => { }),
        isEditMode: true
      });
      expect(parent.querySelector('main.entry')).toBeDefined();
    });

    it('should call onEntryChanged when the entry changes', async () => {
      const parent = document.createElement('div');
      const date = '2020-01-13';
      const onEntryChanged = jest.fn(() => true);
      appendChild(parent, {
        date,
        entry: { date, fields: [{ type: 'text', value: 'foo' }] },
        annuals: [],
        leapYearAnnuals: [],
        periods: [],
        onDayChanged: (date => { }),
        onEntryChanged,
        onAnnualEditRequest: (date => { }),
        onPeriodChanged: (date => { }),
        isEditMode: true
      });
      expect(parent.querySelector('main.entry')).toBeDefined();

      const inputField = parent.querySelector('textarea');
      inputField.value = 'bar';
      inputField.dispatchEvent(new Event('blur'));
      parent.querySelector('form').dispatchEvent(new Event('submit'));
      // await new Promise(process.nextTick);
      expect(onEntryChanged).toHaveBeenCalled();
    });
  });

});
