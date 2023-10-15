import { Element } from '../../public/js/entry/entry-view.html';

describe('EntryView', () => {

  const fields = [
    {
      label: 'Text',
      type: 'text',
      value: 'Hello **world**!'
    },
    {
      label: 'Emoji',
      type: 'emoji',
      value: '🎉'
    },
    {
      label: 'Number',
      type: 'number',
      value: 5,
      unit: 'kg'
    },
    {
      label: 'Color',
      type: 'color',
      value: '#00ff00'
    }
  ];
  const props = {
    entry: { fields }
  }

  it('renders a field item for each field', () => {
    const element = Element(props);

    expect(element.querySelectorAll('.field-item').length).toEqual(fields.length);
  });

  it('renders correct preview for text fields', () => {
    const element = Element({ entry: { fields: [fields[0]] } });

    expect(element.querySelector('.text-field-preview').innerHTML).toContain('<strong>world</strong>');
  });

  it('renders correct preview for emoji fields', () => {
    const element = Element({ entry: { fields: [fields[1]] } });

    expect(element.innerHTML).toContain('🎉');
  });

  it('renders correct preview for number fields', () => {
    const element = Element({ entry: { fields: [fields[2]] } });

    expect(element.querySelector('.number-field-preview').getAttribute('data-unit')).toEqual('kg');
    expect(element.innerHTML).toContain('5');
  });

  it('renders correct preview for color fields', () => {
    const element = Element({ entry: { fields: [fields[3]] } });

    expect(element.querySelector('.color-field-preview').getAttribute('style')).toEqual('background-color:#00ff00');
  });

  it('renders default for unknown field type', () => {
    const element = Element({ entry: { fields: [{ type: 'unknown', value: 'xx' }] } });

    expect(element.innerHTML).toContain('Unknown field type: unknown');
  });

});