import { jest } from '@jest/globals';

const { Element, appendChild } = await import('../../public/js/entry/text-field.html.js');
// const { render } = await import('nano-jsx');

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

    it('calls onValueChanged on blur with sanitized value', async () => {
      const inputField = Element(props).querySelector('#entry-text')
      inputField.value = `<script>alert("Hacked!")</script>`;
      inputField.dispatchEvent(new Event('blur'));
      expect(props.onValueChanged).toHaveBeenCalledWith(
        props.field,
        '&lt;script&gt;alert(\"Hacked!\")&lt;/script&gt;'
      );
    });

    it('should revert to original value if onValueChanged returns false', async () => {
      props.onValueChanged.mockReturnValueOnce(false);
      const inputField = Element(props).querySelector('#entry-text')
      inputField.value = 'bar';
      inputField.dispatchEvent(new Event('blur'));
      // wait until the async operation is over
      await new Promise(process.nextTick);

      expect(inputField.value).toEqual(props.field.value);
    });

    it('should not call onValueChanged if value is not changed', async () => {
      const inputField = Element(props).querySelector('#entry-text')
      await inputField.dispatchEvent(new Event('blur'));

      // wait until the async operation is over
      await new Promise(process.nextTick);

      expect(props.onValueChanged).not.toHaveBeenCalled();
    });
  });

  describe('appendChild', () => {
    it('renders Element', () => {
      const parent = document.createElement('div');
      const field = {
        label: 'Test',
        value: 'foobar'
      };

      appendChild(parent, { field });

      expect(parent.querySelector('.text-field')).toBeDefined();
    });
  });
});