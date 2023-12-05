import { jest } from '@jest/globals';

let dialogProps;

jest.unstable_mockModule('../../public/js/annuals/annual-dialog.html.js', () => ({
  Element: jest.fn((props) => {
    dialogProps = props;
    const element = document.createElement("dialog");
    element.showModal = jest.fn();
    return element;
  })
}));


const { Element } = await import('../../public/js/annuals/annual-list.html.js');

const date = "2000-01-01";

// Tests
describe('AnnualList', () => {
  describe('Element', () => {
    let props;
    let delegate;

    beforeEach(() => {
      props = {
        date,
        items: [{ label: 'period', startYear: 2000 }],
        readonly: [{ label: 'period', startYear: 2000 }],
        onSetDelegate: jest.fn(method => { delegate = method; }),
        onSetAnnuals: jest.fn(() => [{ label: 'new item', startYear: 2000 }])
      };
    });

    it('renders correctly', () => {
      const element = Element(props);

      expect(element.querySelectorAll('.annual-label').length).toBe(props.items.length + props.readonly.length);
      expect([...element.querySelectorAll('.annual-label')][0].textContent).toBe(props.items[0].label);
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