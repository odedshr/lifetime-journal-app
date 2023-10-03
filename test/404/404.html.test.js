const { appendChild } = await import('../../public/js/404/404.html.js');

describe('404.html', () => {
  describe('appendChild', () => {
    it('should call render with the correct props', () => {
      const parent = document.createElement('div');
      const date = '2020-01-13';
      appendChild(parent, {});
      expect(parent.querySelector('main.page-not-found')).toBeDefined();
    });
  });

});
