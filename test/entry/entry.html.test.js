import { jest } from '@jest/globals';

jest.useFakeTimers();

const { appendChild } = await import('../../public/js/entry/entry.html.js');

describe('Entry.html', () => {
  describe('appendChild', () => {
    it('should call render with the correct props', () => {
      const parent = document.createElement('div');
      const date = '2020-01-13';
      appendChild(parent, date, { date, fields: [{ type: 'text', value: 'foo' }] }, [], [],
        (date => { }), // onDayChange  
        (entry => { }), // onEntryChanged
        (date => { }) // onDateChanged
      );
      expect(parent.querySelector('main.entry')).toBeDefined();
    });

    it('should call onEntryChanged when the entry changes', async () => {
      const parent = document.createElement('div');
      const date = '2020-01-13';
      const onEntryChanged = jest.fn();
      appendChild(parent, date,
        { date, fields: [{ type: 'text', value: 'foo' }] }, //entry
        [], // annuals
        [], // read-only annuals
        (date => { }), // onDayChange
        onEntryChanged,
        (date => { }) // onDateChanged
      );
      expect(parent.querySelector('main.entry')).toBeDefined();

      const inputField = parent.querySelector('textarea');
      inputField.value = 'bar';
      inputField.dispatchEvent(new Event('blur'));
      // await new Promise(process.nextTick);
      expect(onEntryChanged).toHaveBeenCalled();
    });
  });

});
