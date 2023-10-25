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

const { Element } = await import('../../public/js/periods/period-list.html.js');

const date = new Date('2000-01-01');

// Tests
describe('PeriodList', () => {
  describe('Element', () => {
    let props;

    beforeEach(() => {
      props = {
        date,
        items: [{ label: 'period', startDate: date }],
        onEditRequest: jest.fn()
      };
    });

    it('renders correctly', () => {
      const element = Element(props);

      expect(element.querySelectorAll('.period-label').length).toBe(props.items.length);
      expect([...element.querySelectorAll('.period-label')][0].textContent).toBe(props.items[0].label);
    });
  });
});