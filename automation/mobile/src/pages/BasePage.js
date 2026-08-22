const path = require('path');
const fs = require('fs');
const config = require('../config/config');
const logger = require('../utils/Logger');
const { find } = require('../utils/ReactNativeFinder');
const GestureUtils = require('../utils/GestureUtils');

/**
 * Enterprise Base Page Object for React Native Android Appium Testing
 */
class BasePage {
  /**
   * @param {WebdriverIO.Browser} driver 
   */
  constructor(driver) {
    this.driver = driver;
  }

  /**
   * Resolve element by selector string, object locator, or Finder expression
   * @param {string|object} locator 
   * @returns {Promise<WebdriverIO.Element>}
   */
  async getElement(locator) {
    if (typeof locator === 'string') {
      return await this.driver.$(locator);
    }
    if (locator.valueKey) {
      return await this.driver.$(find.byValueKey(locator.valueKey));
    }
    if (locator.text) {
      return await this.driver.$(find.byText(locator.text));
    }
    if (locator.semanticsLabel) {
      return await this.driver.$(find.bySemanticsLabel(locator.semanticsLabel));
    }
    if (locator.accessibilityId) {
      return await this.driver.$(find.byAccessibilityId(locator.accessibilityId));
    }
    return await this.driver.$(locator);
  }

  /**
   * Wait until element is visible
   */
  async waitForVisible(locator, timeout = config.explicitWait) {
    const el = await this.getElement(locator);
    await el.waitForDisplayed({
      timeout,
      timeoutMsg: `Element '${JSON.stringify(locator)}' was not displayed after ${timeout}ms`
    });
    return el;
  }

  /**
   * Click / Tap on element with auto-wait
   */
  async tap(locator, timeout = config.explicitWait) {
    logger.info(`Tapping element: ${JSON.stringify(locator)}`);
    const el = await this.waitForVisible(locator, timeout);
    await el.click();
  }

  /**
   * Clear and enter text in input field
   */
  async type(locator, text, timeout = config.explicitWait) {
    logger.info(`Typing text into element: ${JSON.stringify(locator)}`);
    const el = await this.waitForVisible(locator, timeout);
    await el.clearValue();
    await el.setValue(text);
  }

  /**
   * Get text value from element
   */
  async getText(locator, timeout = config.explicitWait) {
    const el = await this.waitForVisible(locator, timeout);
    const text = await el.getText();
    logger.info(`Retrieved text '${text}' from element: ${JSON.stringify(locator)}`);
    return text;
  }

  /**
   * Check if element is displayed without throwing
   */
  async isDisplayed(locator) {
    try {
      const el = await this.getElement(locator);
      return await el.isDisplayed();
    } catch (err) {
      return false;
    }
  }

  /**
   * Capture failure diagnostic package: screenshot, page source/widget tree, and device logs
   */
  async captureFailureArtifacts(testName) {
    const sanitizedName = testName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${sanitizedName}_${timestamp}`;

    if (!fs.existsSync(config.failuresDir)) {
      fs.mkdirSync(config.failuresDir, { recursive: true });
    }

    const screenshotPath = path.join(config.failuresDir, `${filename}.png`);
    const widgetTreePath = path.join(config.failuresDir, `${filename}_widget_tree.xml`);

    try {
      // 1. Screenshot
      await this.driver.saveScreenshot(screenshotPath);
      logger.info(`Failure screenshot saved: ${screenshotPath}`);

      // 2. Widget Tree / XML Hierarchy
      const pageSource = await this.driver.getPageSource();
      fs.writeFileSync(widgetTreePath, pageSource, 'utf8');
      logger.info(`Widget hierarchy dump saved: ${widgetTreePath}`);

      return {
        screenshotPath,
        widgetTreePath
      };
    } catch (error) {
      logger.error(`Error saving failure artifacts: ${error.message}`);
      return { screenshotPath: null, widgetTreePath: null };
    }
  }

  /**
   * Perform gestures via GestureUtils
   */
  async scroll(direction = 'down', ratio = 0.5) {
    await GestureUtils.scroll(this.driver, direction, ratio);
  }

  async swipe(direction = 'left') {
    await GestureUtils.swipe(this.driver, direction);
  }

  async doubleTap(locator) {
    const el = await this.waitForVisible(locator);
    await GestureUtils.doubleTap(this.driver, el);
  }

  async longPress(locator, durationMs = 2000) {
    const el = await this.waitForVisible(locator);
    await GestureUtils.longPress(this.driver, el, durationMs);
  }

  /**
   * Android Hardware Key events
   */
  async pressBack() {
    logger.info('Pressing Android Hardware Back Button');
    await this.driver.back();
  }

  /**
   * App lifecycle helpers
   */
  async restartApp() {
    logger.info('Restarting Application...');
    await this.driver.terminateApp(config.appPackage);
    await this.driver.activateApp(config.appPackage);
  }
}

module.exports = BasePage;
