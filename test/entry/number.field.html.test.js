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

const { Element, appendChild } = await import('../../public/js/entry/number-field.html.js');
const { render } = await import('nano-jsx');

// Tests
describe('NumberField', () => {
  describe('Element', () => {
    let props;

    beforeEach(() => {
      props = {
        field: {
          label: 'Test Label',
          value: 345
        },
        onValueChanged: jest.fn(() => true)
      };
    });

    it('renders correctly', () => {
      const element = Element(props);

      expect(element.querySelector('.number-field')).not.toBeNull();
      expect(element.querySelector('label[for="entry-number"]')).not.toBeNull();
      expect(element.querySelector('input#entry-number')).not.toBeNull();
    });

    it('calls onValueChanged on blur with sanitized value', async () => {
      const inputField = Element(props).querySelector('#entry-number')
      inputField.value = `<script>alert("Hacked!")</script>`;
      inputField.dispatchEvent(new Event('blur'));

      expect(props.onValueChanged).toHaveBeenCalledWith(
        { ...props.field, value: 0 },
        true
      );
    });

    it('should call onValueChanged with isDirty==false if value is not changed', async () => {
      const inputField = Element(props).querySelector('#entry-number')
      await inputField.dispatchEvent(new Event('blur'));
      expect(props.onValueChanged).toHaveBeenCalledWith(props.field, false);
    });

  });
});