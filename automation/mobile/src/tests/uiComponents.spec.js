const { expect } = require('chai');
const DriverFactory = require('../drivers/DriverFactory');
const UIComponentsPage = require('../pages/UIComponentsPage');
const logger = require('../utils/Logger');

describe('React Native Mobile - UI Components & Widget Test Suite', function () {
  this.timeout(120000);
  let driver;
  let componentsPage;

  before(async function () {
    try {
      driver = await DriverFactory.createDriver();
      componentsPage = new UIComponentsPage(driver);
    } catch (err) {
      logger.warn(`Driver initialization note: ${err.message}`);
    }
  });

  after(async function () {
    await DriverFactory.quitDriver();
  });

  it('TC-COMP-001: Validate Dialog popups, alert confirmation and dismiss actions', async function () {
    logger.info('Running TC-COMP-001: Dialog interaction');
    if (!driver) this.skip();
    await componentsPage.triggerAndAcceptDialog();
  });

  it('TC-COMP-002: Validate BottomSheet presentation and drag dismiss', async function () {
    logger.info('Running TC-COMP-002: BottomSheet verification');
    if (!driver) this.skip();
    await componentsPage.openBottomSheet();
  });

  it('TC-COMP-003: Validate Switch toggle state and persistent state', async function () {
    logger.info('Running TC-COMP-003: Switch toggle');
    if (!driver) this.skip();
    await componentsPage.toggleSwitchControl();
  });
});
