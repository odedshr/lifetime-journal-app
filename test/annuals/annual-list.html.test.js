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

const { Element, appendChild } = await import('../../public/js/annuals/annual-list.html.js');
const { render } = await import('nano-jsx');

// Tests
describe('AnnualList', () => {
  describe('Element', () => {
    let props;

    beforeEach(() => {
      props = {
        date: '2000-01-01',
        items: [{ label: 'annual' }],
        readonly: [{ label: 'leapYear' }],
        onEditRequest: jest.fn()
      };
    });

    it('renders correctly', () => {
      const element = Element(props);

      expect(element.querySelectorAll('.annual-label').length).toBe(props.items.length + props.readonly.length);
      expect([...element.querySelectorAll('.annual-label')][0].textContent).toBe(props.items[0].label);
    });
  });

  describe('appendChild', () => {
    let props;

    beforeEach(() => {
      props = {
        annuals: [{ label: 'annual' }],
        readonly: [{ label: 'leapYear' }],
        onEditRequest: jest.fn()
      };
    });

    it('renders Element', () => {
      const parent = document.createElement('div');

      appendChild(parent, '2000-01-01', props.annuals, props.readonly, props.onEditRequest);

      expect(render).toHaveBeenCalledWith(
        expect.objectContaining({
          "component": Element,
          "props": {
            "children": [],
            date: '2000-01-01',
            items: props.annuals,
            readonly: props.readonly,
            onEditRequest: props.onEditRequest
          }
        }),
        parent
      );
    });
  });
});