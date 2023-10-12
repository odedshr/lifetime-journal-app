import { jest } from '@jest/globals';
import { appendChild } from '../../public/js/signin/signin.html.js';

describe('signin html', () => {

  let parent;
  let props;

  beforeEach(() => {
    parent = document.createElement('div');
    props = {
      onSignInButtonClicked: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('appends sign in element', () => {
    appendChild(parent, props);

    expect(parent.querySelector('h1').innerHTML).toEqual('Lifetime Journal');
    expect(parent.querySelector('button.button-sign-in')).toBeTruthy();
  });

  it('calls onSignInButtonClicked on click', async () => {
    appendChild(parent, props);

    parent.querySelector('#btnSignIn').click();

    await new Promise(process.nextTick);

    expect(props.onSignInButtonClicked).toHaveBeenCalled();
  });

  it('disables and enables button on click', async () => {

    props = {
      onSignInButtonClicked: () => {
        expect(parent.querySelector('#btnSignIn').disabled).toBeTruthy();
      }
    }
    appendChild(parent, props);

    const btn = parent.querySelector('#btnSignIn');

    expect(btn.disabled).toBeFalsy();

    await btn.click();

    await new Promise(process.nextTick);

    expect(btn.disabled).toBeFalsy();
  });

});