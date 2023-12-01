import { jest } from '@jest/globals';

let dialogProps;

jest.unstable_mockModule('../../public/js/periods/period-dialog.html.js', () => ({
  Element: jest.fn((props) => {
    dialogProps = props;
    const element = document.createElement("dialog");
    element.showModal = jest.fn();
    return element;
  })
}));

const { Element } = await import('../../public/js/periods/period-list.html.js');

const date = new Date('2000-01-01');

// Tests
describe('PeriodList', () => {
  describe('Element', () => {
    let props;
    let delegate;

    beforeEach(() => {
      props = {
        date,
        items: [{ label: 'period', startDate: date }],
        onSetDelegate: jest.fn(method => { delegate = method; }),
        onSetPeriod: jest.fn(() => [{ label: 'new item', startDate: date }])
      };
    });

    it('renders correctly', () => {
      const element = Element(props);

      expect(element.querySelectorAll('.period-label').length).toBe(props.items.length);
      expect([...element.querySelectorAll('.period-label')][0].textContent).toBe(props.items[0].label);
    });

    it('refreshes list on update', () => {
      const element = Element(props);
      delegate();
      dialogProps.onChanged({ id: 'aa' }, 'aa');
    });

    it('refreshes list on delete', () => {
      const element = Element(props);
      delegate({ id: 'aa' });
      dialogProps.onDelete();
    });
  });
});