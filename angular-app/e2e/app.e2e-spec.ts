import { AngularTestPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('Starting tests for 3d-printer', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be 3d-printer', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result) => {
      expect(result).toBe('3d-printer');
    });
  });

});
