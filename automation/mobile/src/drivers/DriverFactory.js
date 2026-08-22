const { remote } = require('webdriverio');
const config = require('../config/config');
const logger = require('../utils/Logger');

class DriverFactory {
  constructor() {
    this.driver = null;
  }

  /**
   * Initializes Appium 2.x WebDriver session
   */
  async createDriver() {
    if (this.driver) {
      return this.driver;
    }

    const capabilities = {
      platformName: config.platformName,
      'appium:platformVersion': config.platformVersion,
      'appium:deviceName': config.deviceName,
      'appium:udid': config.udid,
      'appium:automationName': config.automationName,
      'appium:app': config.apkPath,
      'appium:appPackage': config.appPackage,
      'appium:appActivity': config.appActivity,
      'appium:noReset': config.noReset,
      'appium:fullReset': config.fullReset,
      'appium:autoGrantPermissions': config.autoGrantPermissions,
      'appium:newCommandTimeout': config.newCommandTimeout,
      'appium:uiautomator2ServerInstallTimeout': config.uiautomator2ServerInstallTimeout,
      'appium:adbExecTimeout': config.adbExecTimeout
    };

    const options = {
      hostname: config.appiumHost,
      port: config.appiumPort,
      path: config.appiumPath,
      capabilities: capabilities,
      logLevel: 'error'
    };

    logger.info(`Initializing Appium 2.x session with capabilities:`, capabilities);

    try {
      this.driver = await remote(options);
      logger.info(`Appium session created successfully. Session ID: ${this.driver.sessionId}`);
      return this.driver;
    } catch (error) {
      logger.error(`Failed to initialize Appium driver: ${error.message}`);
      throw error;
    }
  }

  /**
   * Returns current active driver instance
   */
  getDriver() {
    return this.driver;
  }

  /**
   * Closes Appium session and cleans up
   */
  async quitDriver() {
    if (this.driver) {
      try {
        logger.info('Closing Appium driver session...');
        await this.driver.deleteSession();
        this.driver = null;
        logger.info('Appium session terminated cleanly.');
      } catch (err) {
        logger.warn(`Error while terminating driver session: ${err.message}`);
        this.driver = null;
      }
    }
  }
}

// Export singleton instance
module.exports = new DriverFactory();
