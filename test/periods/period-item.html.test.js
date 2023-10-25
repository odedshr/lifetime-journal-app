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

const { Element, appendChild } = await import('../../public/js/periods/period-item.html.js');
const { render } = await import('nano-jsx');
const now = new Date('2000-01-01');

// Tests
describe('PeriodItem', () => {
  describe('Element', () => {
    let props;

    beforeEach(() => {
      props = {
        date: new Date('2000-01-01'),
        data: {
          label: 'Test Label',
          startDate: now
        },
        onEditRequest: jest.fn()
      };
    });

    it('renders correctly', () => {
      const element = Element(props);

      expect(element.querySelector('.period-label')).not.toBeNull();
      expect(element.querySelector('.period-edit')).not.toBeNull();
    });

    it('hides edit button when onEditRequest not available', async () => {
      props.onEditRequest = undefined;
      const element = Element(props);

      expect(element.querySelector('.period-label')).not.toBeNull();
      expect(element.querySelector('.period-edit')).toBeNull();
    });

    it('triggers onEditRequest when edit button clicked', () => {
      const element = Element(props);

      element.querySelector('.period-edit').click();
      expect(props.onEditRequest).toHaveBeenCalled();
    });

    it('identifies item that ended today', () => {
      props.data.endDate = now;
      const element = Element(props);

      expect(element.classList.contains('period-end')).toBe(true);
    });

    it('identifies items that started today', () => {
      props.data.startDate = now;
      const element = Element(props);

      expect(element.classList.contains('period-start')).toBe(true);
    });
  });

  describe('appendChild', () => {
    it('renders Element', () => {
      const parent = document.createElement('div');

      appendChild(parent, { label: 'Test' }, now);

      expect(render).toHaveBeenCalledWith(
        expect.objectContaining({
          "component": Element,
          "props": { "children": [], "data": { label: 'Test' }, "date": now, "onEditRequest": undefined }
        }),
        parent
      );
    });
  });
});