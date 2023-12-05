import { jest } from '@jest/globals';

const { Element } = await import('../../public/js/annuals/annual-dialog.html.js');

// Tests
describe('AnnualDialog', () => {
  describe('Element', () => {
    let props;

    beforeEach(() => {
      props = {
        annual: {
          label: 'Test Label',
          startYear: 2000,
          endYear: 2010,
          color: '#ff0000'
        },
        onChanged: jest.fn(),
        onCancel: jest.fn(),
        onDelete: jest.fn(),
      };
    });

    it('renders correctly', () => {
      const element = Element(props);

      expect(element.querySelector('#annual-label')).not.toBeNull();
      expect(element.querySelector('#annual-startYear')).not.toBeNull();
      expect(element.querySelector('#annual-endYear')).not.toBeNull();
      expect(element.querySelector('#annual-color')).not.toBeNull();

      expect(element.querySelector('.btn-save')).not.toBeNull();
      expect(element.querySelector('.btn-cancel')).not.toBeNull();
      expect(element.querySelector('.btn-delete')).not.toBeNull();
    });

    it('hides cancel and delete button according to props', () => {
      const element = Element({
        annual: {
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

      element.querySelector('#annual-label').value = 'Test Label 2';
      element.querySelector('#annual-startYear').value = '0';
      element.querySelector('#annual-endYear').value = '10';
      element.querySelector('#annual-color').value = '#000000';
      await element.querySelector("form").submit();
      expect(props.onChanged).toHaveBeenCalled();
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
      const element = Element(props);

      element.querySelector('.btn-delete').click();
      expect(props.onDelete).toHaveBeenCalled();
    });
  });
});