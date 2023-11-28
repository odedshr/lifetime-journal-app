import { jest } from '@jest/globals';

const { Element } = await import('../../public/js/diaries/diary-save-dialog.html');

describe('DiarySave Dialog', () => {
  let showModal;
  let props = {
    onDelegatorProvided: delegate => { showModal = delegate; },
    onSaveRequest: jest.fn(() => ["error"])
  };

  it('should renders without errors', () => {
    const element = Element(props);

    expect(element.querySelector('input[name="name"]')).not.toBeNull();
    expect(element.querySelector('input[name="uri"]')).not.toBeNull();
    expect(element.querySelector('input[name="startDate"]')).not.toBeNull();
    expect(element.querySelector('input[name="color"]')).not.toBeNull();
  });

  it('shows modal on click', () => {
    const element = Element(props);
    element.showModal = jest.fn();

    showModal({ name: "name", ur: "uri" });
    expect(element.showModal).toHaveBeenCalled();
  });

  it('calls onSaveRequest when Save button is clicked with valid form data', async () => {
    const element = Element(props);

    // Mock the FormData function
    global.FormData = function () {
      this.get = jest.fn((key) => (key === "action") ? "save" : `test-${key}`);
    };

    const form = element.querySelector("form");
    form.reportValidity = jest.fn(() => true);
    global.console.log = jest.fn();

    await element.querySelector("button[value='save']").click();
    await new Promise(process.nextTick);

    //annoyingly the button doesn't do the submit in test env
    expect(form.reportValidity).toHaveBeenCalled();
    expect(global.console.log).toHaveBeenCalled();
    expect(props.onSaveRequest).toHaveBeenCalledWith({
      name: 'test-name',
      uri: 'test-uri',
      startDate: 'test-startDate',
      color: 'test-color',
      defaultFields: undefined,
    });
  });

});
