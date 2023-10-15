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

      expect(element.querySelector('.entry-input')).not.toBeNull();
      expect(element.querySelector('label[for="entry-text"]')).not.toBeNull();
      expect(element.querySelector('textarea#entry-text')).not.toBeNull();
    });

    it('calls onValueChanged on blur with sanitized value', async () => {
      const inputField = Element(props).querySelector('#entry-text')
      inputField.value = `<script>alert("Hacked!")</script>`;
      inputField.dispatchEvent(new Event('blur'));
      expect(props.onValueChanged).toHaveBeenCalledWith(
        { ...props.field, value: '&lt;script&gt;alert(\"Hacked!\")&lt;/script&gt;' },
        true
      );
    });

    it('should call onValueChanged with isDirty==false if value is not changed', async () => {
      const inputField = Element(props).querySelector('#entry-text')
      await inputField.dispatchEvent(new Event('blur'));

      // wait until the async operation is over
      await new Promise(process.nextTick);

      expect(props.onValueChanged).toHaveBeenCalledWith(props.field, false);
    });
  });
});