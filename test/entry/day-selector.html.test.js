import { jest } from '@jest/globals';
import { appendChild } from '../../public/js/entry/day-selector.html.js';

describe('DaySelector', () => {

  let container;
  let props;

  beforeEach(() => {
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

    expect(container.querySelector('div.day-selector')).not.toBeNull();
    expect(container.querySelector('button#btnPrevious')).not.toBeNull();
  });

  it('calls onDayChanged when previous button clicked', () => {
    appendChild(container, props);

    const btn = container.querySelector('button#btnPrevious');
    btn.click();

    expect(props.onDayChanged).toHaveBeenCalledWith('2022-12-31');
  });

  it('calls onDayChanged when next button clicked', () => {
    appendChild(container, props);

    const btn = container.querySelector('button#btnNext');
    btn.click();

    expect(props.onDayChanged).toHaveBeenCalledWith('2023-01-02');
  });

  it('calls onDayChanged when date input changed', () => {
    appendChild(container, props);

    const input = container.querySelector('input[type="date"]');
    input.value = '2023-02-14';
    input.dispatchEvent(new Event('change'));

    expect(props.onDayChanged).toHaveBeenCalledWith('2023-02-14');
  });

});