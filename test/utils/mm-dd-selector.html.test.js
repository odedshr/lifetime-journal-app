import { jest } from '@jest/globals';
import { appendChild } from '../../public/js/utils/mm-dd-selector.html.js';

describe('MmDdSelector', () => {

  let container;
  let props;
  let languageGetter;

  beforeEach(() => {
    languageGetter = jest.spyOn(window.navigator, 'language', 'get')
    container = document.createElement('div');
    props = {
      date: '2023-01-01',
      onDayChanged: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    appendChild(container, props);

    expect(container.querySelector('.month-selector')).not.toBeNull();
    expect(container.querySelector('.day-selector')).not.toBeNull();
  });

  it('calls onDayChanged when month input changed', () => {
    appendChild(container, props);

    const input = container.querySelector('.month-selector');
    input.selectedIndex = 6;
    input.dispatchEvent(new Event('change'));

    expect(props.onDayChanged).toHaveBeenCalledWith('2023-06-30');
  });

  it('calls onDayChanged when day input changed', () => {
    appendChild(container, props);

    const input = container.querySelector('.day-selector');
    input.options[5].selected = true;
    input.dispatchEvent(new Event('change'));

    expect(props.onDayChanged).toHaveBeenCalledWith('2023-01-06');
  });

});