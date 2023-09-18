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

const { Element, appendChild } = await import('../../public/js/entry/text-field.html.js');
const { render } = await import('nano-jsx');

// Tests
describe('TextField', () => {
  describe('Element', () => {
    let props;

    beforeEach(() => {
      props = {
        field: {
          label: 'Test Label',
          value: 'foo'
        },
        onValueChanged: jest.fn(() => true)
      };
    });

    it('renders correctly', () => {
      const element = Element(props);

      expect(element.querySelector('.text-field')).not.toBeNull();
      expect(element.querySelector('label[for="entry-text"]')).not.toBeNull();
      expect(element.querySelector('textarea#entry-text')).not.toBeNull();
    });

    // it('calls onValueChanged on blur with sanitized value', async () => {
    //   const inputField = Element(props).querySelector('#entry-text')
    //   inputField.value = `<script>alert("Hacked!")</script>`;
    //   inputField.dispatchEvent(new Event('blur'));

    //   expect(props.onValueChanged).toHavecxvBeenCalledWith(
    //     props.field,
    //     '&lt;script&gt;alert(\"Hacked!\")&lt;/script&gt;'
    //   );
    // });

    // it('should revert to original value if onValueChanged returns false', async () => {
    //   props.onValueChanged.mockReturnValueOnce(false);
    //   const inputField = Element(props).querySelector('#entry-text')
    //   inputField.value = 'bar';
    //   inputField.dispatchEvent(new Event('blur'));
    //   expect(inputField.value).toEqual(props.field.value);
    // });

    // it('should not call onValueChanged if value is not changed', async () => {
    //   const inputField = Element(props).querySelector('#entry-text')
    //   await inputField.dispatchEvent(new Event('blur'));
    //   expect(props.onValueChanged).not.toHaveBeenCalled();
    // });

  });

  describe('appendChild', () => {
    it('renders Element', () => {
      const parent = document.createElement('div');
      const field = {
        label: 'Test',
        value: 'foobar'
      };

      appendChild(parent, { field });

      expect(render).toHaveBeenCalledWith(
        expect.objectContaining({ "component": Element, "props": { "children": [], "field": { "label": "Test", "value": "foobar" }, "onValueChanged": undefined } }),
        parent
      );
    });
  });
});