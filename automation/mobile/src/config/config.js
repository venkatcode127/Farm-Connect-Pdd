const path = require('path');
require('dotenv').config();

const config = {
  // App & APK settings
  apkPath: process.env.APK_PATH || path.resolve(__dirname, '../../../../android-app/app/build/outputs/apk/debug/app-debug.apk'),
  appPackage: process.env.APP_PACKAGE || 'com.farmconnect.app',
  appActivity: process.env.APP_ACTIVITY || 'com.farmconnect.app.MainActivity',
  
  // Appium server connection
  appiumHost: process.env.APPIUM_HOST || '127.0.0.1',
  appiumPort: parseInt(process.env.APPIUM_PORT || '4723', 10),
  appiumPath: process.env.APPIUM_PATH || '/',

  // Platform & Device
  platformName: process.env.PLATFORM_NAME || 'Android',
  platformVersion: process.env.PLATFORM_VERSION || '13.0',
  deviceName: process.env.DEVICE_NAME || 'Pixel_5_API_33',
  udid: process.env.UDID || 'emulator-5554',
  automationName: process.env.AUTOMATION_NAME || 'UiAutomator2', // Supports 'Flutter' or 'UiAutomator2'

  // Execution Flags
  noReset: process.env.NO_RESET === 'true',
  fullReset: process.env.FULL_RESET === 'true',
  autoGrantPermissions: true,
  autoAcceptAlerts: true,
  newCommandTimeout: 300,
  uiautomator2ServerInstallTimeout: 60000,
  adbExecTimeout: 60000,

  // Timeouts
  implicitWait: 5000,
  explicitWait: 15000,

  // Reporting Paths
  reportsDir: path.resolve(__dirname, '../../reports'),
  screenshotsDir: path.resolve(__dirname, '../../reports/screenshots'),
  failuresDir: path.resolve(__dirname, '../../reports/failures'),
  logsDir: path.resolve(__dirname, '../../reports/logs'),
  excelReportPath: path.resolve(__dirname, '../../reports/ReactNative_E2E_Report.xlsx')
};

module.exports = config;
