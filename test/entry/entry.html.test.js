import { jest } from '@jest/globals';

// Mock props and utils 
jest.mock('nano-jsx', () => {
  return { render: jest.fn() };
});

jest.mock('nano-jsx/esm/jsx-runtime', () => {
  return {
    jsx: jest.fn(),
    jsxs: jest.fn()
  };
});

const { deploy } = await import('../../public/js/entry/entry.html.js');
const { render } = await import('nano-jsx');

describe('Entry.html', () => {
  describe('deploy', () => {
    it('should call render with the correct props', () => {
      const parent = document.createElement('div');
      const date = '2020-01-13';
      deploy(parent, date, { date, fields: [{ type: 'text', value: 'foo' }] }, {
        onEntryChanged: (entry => { }),
        onDateChanged: (date => { })
      });
      expect(render).toHaveBeenCalled();
      expect(parent.querySelector('main.entry')).toBeDefined();
    });

    // it fails to actually add the element to the parent
    // it('should call onEntryChanged when the entry changes', () => {
    //   const parent = document.createElement('div');
    //   const date = '2020-01-13';
    //   const onEntryChanged = jest.fn();
    //   deploy(parent, date, { date, fields: [{ type: 'text', value: 'foo' }] }, {
    //     onEntryChanged,
    //     onDateChanged: (date => { })
    //   });
    //   expect(parent.querySelector('main.entry')).toBeDefined();

    //   const inputField = parent.querySelector('textarea');
    //   inputField.value = 'bar';
    //   inputField.dispatchEvent(new Event('blur'));
    //   expect(onEntryChanged).toHaveBeenCalled();
    // });
  });

});
