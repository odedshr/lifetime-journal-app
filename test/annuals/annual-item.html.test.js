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

const { Element, appendChild } = await import('../../public/js/annuals/annual-item.html.js');
const { render } = await import('nano-jsx');

// Tests
describe('AnnualItem', () => {
  describe('Element', () => {
    let props;

    beforeEach(() => {
      props = {
        date: '2000-01-01',
        data: {
          label: 'Test Label',
          startYear: 2000
        },
        onEditRequest: jest.fn()
      };
    });

    it('renders correctly', () => {
      const element = Element(props);

      expect(element.querySelector('.annual-label')).not.toBeNull();
      expect(element.querySelector('.annual-edit')).not.toBeNull();
    });

    it('hides edit button when onEditRequest not available', async () => {
      props = { date: '2000-01-01', data: { label: 'Test' } }
      const element = Element(props);

      expect(element.querySelector('.annual-label')).not.toBeNull();
      expect(element.querySelector('.annual-edit')).toBeNull();
    });

    it('triggers onEditRequest when edit button clicked', () => {
      const element = Element(props);

      element.querySelector('.annual-edit').click();
      expect(props.onEditRequest).toHaveBeenCalled();
    });

    it('identifies items that have ended', () => {
      props.data.endYear = 1900;
      const element = Element(props);

      expect(element.classList.contains('past-event')).toBe(true);
    });

    it('identifies items that haven\'t yet started', () => {
      props.data.startYear = 2100;
      const element = Element(props);

      expect(element.classList.contains('future-event')).toBe(true);
    });
  });

  describe('appendChild', () => {
    it('renders Element', () => {
      const parent = document.createElement('div');

      appendChild(parent, { label: 'Test' });

      expect(render).toHaveBeenCalledWith(
        expect.objectContaining({
          "component": Element,
          "props": { "children": [], "data": { label: 'Test' }, "onEditRequest": undefined }
        }),
        parent
      );
    });
  });
});