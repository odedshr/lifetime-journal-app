import { jest } from '@jest/globals';

const { Element } = await import('../../public/js/periods/period-dialog.html.js');

// Tests
describe('PeriodDialog', () => {
  describe('Element', () => {
    let props;

    beforeEach(() => {
      props = {
        period: {
          label: 'Test Label',
          startDate: new Date('2000-01-01'),
          endDate: new Date('2000-02-01'),
          color: '#ff0000'
        },
        onChanged: jest.fn(),
        onCancel: jest.fn(),
        onDelete: jest.fn(),
      };
    });

    it('renders correctly', () => {
      const element = Element(props);

      expect(element.querySelector('#period-label')).not.toBeNull();
      expect(element.querySelector('#period-start')).not.toBeNull();
      expect(element.querySelector('#period-end')).not.toBeNull();
      expect(element.querySelector('#period-color')).not.toBeNull();

      expect(element.querySelector('.btn-save')).not.toBeNull();
      expect(element.querySelector('.btn-cancel')).not.toBeNull();
      expect(element.querySelector('.btn-delete')).not.toBeNull();
    });

    it('hides cancel and delete button according to props', () => {
      const element = Element({
        period: {
          label: 'Test Label',
          startYear: 2000
        },
        onChanged: jest.fn()
      });

      expect(element.querySelector('.btn-cancel')).toBeNull();
      expect(element.querySelector('.btn-delete')).toBeNull();
    });

    it('triggers onChanged when form is submitted', async () => {
      const element = Element(props);

      element.querySelector('#period-label').value = 'Test Label 2';
      element.querySelector('#period-start').value = '2000-01-02';
      element.querySelector('#period-end').value = '2000-01-10';
      element.querySelector('#period-color').value = '#000000';
      await element.querySelector("form").submit();
      expect(props.onChanged).toHaveBeenCalled();
    });

    it("allows removing the period end", async () => {
      const element = Element(props);
      element.querySelector('#period-end').value = '';
      await element.querySelector("form").submit();
      expect(props.onChanged).toHaveBeenCalledWith({
        "color": "#ff0000",
        "endDate": undefined,
        "label": "Test Label",
        "startDate": new Date('2000-01-01')
      });
    });


    it("doesn't trigger onChanged when no changes made and form is submitted", async () => {
      const element = Element(props);
      await element.querySelector("form").submit();
      expect(props.onChanged).not.toHaveBeenCalled();
    });

    it('triggers onCancel when edit button clicked', () => {
      const element = Element(props);

      element.querySelector('.btn-cancel').click();
      expect(props.onCancel).toHaveBeenCalled();
    });

    it('triggers onDelete when edit button clicked', () => {
      global.window.confirm = jest.fn(() => true);
      const element = Element(props);

      element.querySelector('.btn-delete').click();
      expect(props.onDelete).toHaveBeenCalled();
    });
  });
});