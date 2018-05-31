import { AngularTestPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('Starting tests for 3d-printer', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be 3d-printer', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('3d-printer');
    })
  });

  it('navbar-brand should be printer-use-case@0.0.1',() => {
    var navbarBrand = element(by.css('.navbar-brand')).getWebElement();
    expect(navbarBrand.getText()).toBe('printer-use-case@0.0.1');
  });

  
    it('QualityRequirement component should be loadable',() => {
      page.navigateTo('/QualityRequirement');
      var assetName = browser.findElement(by.id('assetName'));
      expect(assetName.getText()).toBe('QualityRequirement');
    });

    it('QualityRequirement table should have 6 columns',() => {
      page.navigateTo('/QualityRequirement');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(6); // Addition of 1 for 'Action' column
      });
    });

  
    it('BlueprintCopy component should be loadable',() => {
      page.navigateTo('/BlueprintCopy');
      var assetName = browser.findElement(by.id('assetName'));
      expect(assetName.getText()).toBe('BlueprintCopy');
    });

    it('BlueprintCopy table should have 9 columns',() => {
      page.navigateTo('/BlueprintCopy');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(9); // Addition of 1 for 'Action' column
      });
    });

  

});
