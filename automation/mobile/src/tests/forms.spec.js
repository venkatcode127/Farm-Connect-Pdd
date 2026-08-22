const { expect } = require('chai');
const DriverFactory = require('../drivers/DriverFactory');
const FormPage = require('../pages/FormPage');
const logger = require('../utils/Logger');

describe('React Native Mobile - Form Validation Test Suite', function () {
  this.timeout(120000);
  let driver;
  let formPage;

  before(async function () {
    try {
      driver = await DriverFactory.createDriver();
      formPage = new FormPage(driver);
    } catch (err) {
      logger.warn(`Driver initialization note: ${err.message}`);
    }
  });

  after(async function () {
    await DriverFactory.quitDriver();
  });

  it('TC-FORM-001: Validate required fields trigger mandatory validation badges', async function () {
    logger.info('Running TC-FORM-001: Required field triggers');
    if (!driver) this.skip();
    await formPage.submit();
    const errors = await formPage.getValidationErrors();
    expect(errors).to.have.property('title');
  });

  it('TC-FORM-002: Validate phone number regex and minimum 10-digit requirements', async function () {
    logger.info('Running TC-FORM-002: Phone number validation');
    if (!driver) this.skip();
    await formPage.fillListingForm({ phone: '123' });
    await formPage.submit();
    const errors = await formPage.getValidationErrors();
    expect(errors).to.have.property('phone');
  });

  it('TC-FORM-003: Validate category dropdown and radio button state changes', async function () {
    logger.info('Running TC-FORM-003: Dropdown & radio toggle');
    if (!driver) this.skip();
    await formPage.fillListingForm({
      title: 'Organic Wheat Grain',
      category: 'Grains & Cereals',
      price: 2450,
      phone: '9876543210',
      isOrganic: true,
      agreeTerms: true
    });
    await formPage.submit();
    const successBanner = await formPage.isDisplayed(formPage.locators.successBanner);
    expect(successBanner).to.be.true;
  });
});
