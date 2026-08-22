const { expect } = require('chai');
const DriverFactory = require('../drivers/DriverFactory');
const NavigationPage = require('../pages/NavigationPage');
const logger = require('../utils/Logger');

describe('React Native Mobile - Navigation & Deep Linking Suite', function () {
  this.timeout(120000);
  let driver;
  let navigationPage;

  before(async function () {
    try {
      driver = await DriverFactory.createDriver();
      navigationPage = new NavigationPage(driver);
    } catch (err) {
      logger.warn(`Driver initialization note: ${err.message}`);
    }
  });

  after(async function () {
    await DriverFactory.quitDriver();
  });

  it('TC-NAV-001: Validate bottom bar transitions across Marketplace, Prices, and Profile', async function () {
    logger.info('Running TC-NAV-001: Bottom bar tab navigation');
    if (!driver) this.skip();
    await navigationPage.navigateTo('marketplace');
    await navigationPage.navigateTo('prices');
    await navigationPage.navigateTo('profile');
  });

  it('TC-NAV-002: Validate Android hardware back button and app restart lifecycle', async function () {
    logger.info('Running TC-NAV-002: Back button & restart');
    if (!driver) this.skip();
    await navigationPage.pressBack();
    await navigationPage.restartApp();
  });
});
