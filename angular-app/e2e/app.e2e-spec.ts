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
    it('QualityRequirement table should have 6 columns', () => {
      page.navigateTo('/QualityRequirement');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(6); // Addition of 1 for 'Action' column
      });
    });

});
