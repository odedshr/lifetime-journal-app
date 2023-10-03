import { jest } from '@jest/globals';

jest.unstable_mockModule('../../public/js/404/404.html.js', () => ({
  appendChild: jest.fn(async () => ({}))
}));

const { switchPage } = await import('../../public/js/404/404.controller.js');
const { appendChild } = await import('../../public/js/404/404.html.js');

describe('404.Controller', () => {

  describe('switchPage', () => {

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('sets page title', async () => {
      await switchPage();
      expect(document.title).toEqual('Page not found | Lifetime Journal');
    });

    it('appends page content', async () => {
      await switchPage();
      expect(appendChild).toHaveBeenCalled();
    });
  });
});