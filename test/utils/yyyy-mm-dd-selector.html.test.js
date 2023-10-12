import { jest } from '@jest/globals';
import { appendChild } from '../../public/js/utils/yyyy-mm-dd-selector.html.js';

describe('YyyyMmDdSelector', () => {

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

    expect(container.querySelector('div.date-selector')).not.toBeNull();
    expect(container.querySelector('input[type="date"]')).not.toBeNull();
  });

  it('calls onDayChanged when date input changed', () => {
    appendChild(container, props);

    const input = container.querySelector('input[type="date"]');
    input.value = '2023-02-14';
    input.dispatchEvent(new Event('change'));

    expect(props.onDayChanged).toHaveBeenCalledWith('2023-02-14');
  });

});