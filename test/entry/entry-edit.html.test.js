import { jest } from '@jest/globals';
import { Element } from '../../public/js/entry/entry-edit.html';

const testFields = [
  {
    id: '1',
    type: 'text',
    value: 'Test'
  },
  {
    id: '2',
    type: 'emoji',
    value: '🎉'
  }
];

describe('EntryEdit', () => {

  let element;
  let onEntryChangedMock;
  let onExitPageMock;

  beforeEach(() => {
    onEntryChangedMock = jest.fn(() => { console.log('here!'); return true });
    onExitPageMock = jest.fn(() => true);
    element = Element({
      entry: { fields: testFields },
      onEntryChanged: onEntryChangedMock,
      onExitPage: onExitPageMock
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a field editor for each field', () => {
    expect(element.querySelectorAll('.text-field').length).toBe(1);
    expect(element.querySelectorAll('.emoji-field').length).toBe(1);
  });

  it('calls onEntryChanged when form submitted', async () => {
    const textField = element.querySelector('.text-field .entry-input');
    textField.value = 'xx';
    textField.dispatchEvent(new Event('blur'));
    element.submit();

    await new Promise(process.nextTick);

    expect(onEntryChangedMock).toHaveBeenCalledWith(
      expect.objectContaining({
        "fields": [
          { ...testFields[0], "value": "xx" },
          testFields[1]]
      })
    );
  });

  it('calls onExitPage when form reset', async () => {
    element.querySelector('button.btn-cancel').click();
    await new Promise(process.nextTick);

    expect(onExitPageMock).toHaveBeenCalled();
  });

  it('tracks dirty state', async () => {
    const textField = element.querySelector('input[type=text]');

    textField.value = 'xx';
    textField.dispatchEvent(new Event('blur'));
    await element.submit();

    expect(onEntryChangedMock).toHaveBeenCalledTimes(1);

    await element.submit();

    expect(onEntryChangedMock).toHaveBeenCalledTimes(1);
  });

});