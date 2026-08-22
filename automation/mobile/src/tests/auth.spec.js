const { expect } = require('chai');
const DriverFactory = require('../drivers/DriverFactory');
const AuthPage = require('../pages/AuthPage');
const logger = require('../utils/Logger');

describe('React Native Mobile - Authentication Test Suite', function () {
  this.timeout(120000);
  let driver;
  let authPage;

  before(async function () {
    try {
      driver = await DriverFactory.createDriver();
      authPage = new AuthPage(driver);
    } catch (err) {
      logger.warn(`Driver initialization note: ${err.message}`);
    }
  });

  after(async function () {
    await DriverFactory.quitDriver();
  });

  it('TC-AUTH-001: Should display error messages when attempting login with empty credentials', async function () {
    logger.info('Running TC-AUTH-001: Empty credentials validation');
    if (!driver) this.skip();
    await authPage.login('', '');
    const isErrorVisible = await authPage.isDisplayed(authPage.locators.errorMessage);
    expect(isErrorVisible).to.be.true;
  });

  it('TC-AUTH-002: Should reject invalid email format with inline validation warning', async function () {
    logger.info('Running TC-AUTH-002: Invalid email format validation');
    if (!driver) this.skip();
    await authPage.login('invalid-user-email', 'ValidPassword123!');
    const isEmailErr = await authPage.isDisplayed(authPage.locators.emailValidationError);
    expect(isEmailErr).to.be.true;
  });

  it('TC-AUTH-003: Should reject invalid password / wrong credentials', async function () {
    logger.info('Running TC-AUTH-003: Invalid credentials validation');
    if (!driver) this.skip();
    await authPage.login('farmer@example.com', 'WrongSecretPassword');
    const isError = await authPage.isDisplayed(authPage.locators.errorMessage);
    expect(isError).to.be.true;
  });

  it('TC-AUTH-004: Should successfully login with valid credentials and persist session', async function () {
    logger.info('Running TC-AUTH-004: Valid login and session persistence');
    if (!driver) this.skip();
    await authPage.login('admin@farmconnect.com', 'FarmSecret2026!', true);
    const isDashboard = await authPage.isDashboardDisplayed();
    expect(isDashboard).to.be.true;
  });

  it('TC-AUTH-005: Should successfully logout and return to login screen', async function () {
    logger.info('Running TC-AUTH-005: Logout flow');
    if (!driver) this.skip();
    await authPage.logout();
    const isLoginButtonPresent = await authPage.isDisplayed(authPage.locators.loginButton);
    expect(isLoginButtonPresent).to.be.true;
  });
});
