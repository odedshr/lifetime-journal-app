import { jest } from '@jest/globals';
import { appendChild } from '../../public/js/utils/date-selector.html.js';

describe('DaySelector', () => {

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
    expect(container.querySelector('#btnPrevious')).not.toBeNull();
  });

  it('calls onDayChanged when previous button clicked', () => {
    appendChild(container, props);

    const btn = container.querySelector('#btnPrevious');
    btn.click();

    expect(props.onDayChanged).toHaveBeenCalledWith('2022-12-31');
  });

  it('should have the next button showing the name of the previous day', () => {
    languageGetter.mockReturnValue('en-GB');

    appendChild(container, props);

    const btn = container.querySelector('#btnPrevious');

    expect(btn.innerHTML).toBe('<span>Sat</span>');

  });

  it('should have the next button showing the name of the next day', () => {
    languageGetter.mockReturnValue('en-GB');

    appendChild(container, props);

    const btn = container.querySelector('#btnNext');

    expect(btn.innerHTML).toBe('<span>Mon</span>');
  });

  it('calls onDayChanged when next button clicked', () => {
    languageGetter.mockReturnValue('en-GB');

    appendChild(container, props);

    const btn = container.querySelector('#btnNext');

    btn.click();
    expect(props.onDayChanged).toHaveBeenCalledWith('2023-01-02');
  });
});