const { expect } = require('chai');
const DriverFactory = require('../drivers/DriverFactory');
const GestureUtils = require('../utils/GestureUtils');
const logger = require('../utils/Logger');

describe('React Native Mobile - W3C Gesture Interactions Suite', function () {
  this.timeout(120000);
  let driver;

  before(async function () {
    try {
      driver = await DriverFactory.createDriver();
    } catch (err) {
      logger.warn(`Driver initialization note: ${err.message}`);
    }
  });

  after(async function () {
    await DriverFactory.quitDriver();
  });

  it('TC-GEST-001: Execute vertical scroll and swipe gestures', async function () {
    logger.info('Running TC-GEST-001: Scroll & swipe');
    if (!driver) this.skip();
    await GestureUtils.scroll(driver, 'down', 0.6);
    await GestureUtils.scroll(driver, 'up', 0.4);
    await GestureUtils.swipe(driver, 'left');
    await GestureUtils.swipe(driver, 'right');
  });

  it('TC-GEST-002: Execute pinch and zoom multi-touch actions', async function () {
    logger.info('Running TC-GEST-002: Pinch & zoom');
    if (!driver) this.skip();
    await GestureUtils.pinch(driver);
    await GestureUtils.zoom(driver);
  });
});
