// appium.conf.js
module.exports = {
  runner: 'local',
  port: 4723,
  path: '/wd/hub',
  specs: ['./src/tests/**/*.spec.js'],
  capabilities: [
    {
      platformName: 'Android',
      automationName: 'UiAutomator2',
      // React Native driver will be added dynamically if available
      app: process.env.APK_PATH || './app/app-release.apk',
      appPackage: process.env.APP_PACKAGE || 'com.company.app',
      appActivity: process.env.APP_ACTIVITY || 'com.company.app.MainActivity',
      autoGrantPermissions: true,
      noReset: false,
      fullReset: true,
    },
  ],
  logLevel: 'info',
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 600000,
  },
  reporters: [
    ['mochawesome', {
      outputDir: './reports/mochawesome',
      outputFilename: 'index',
      quiet: true,
    }]
  ],
  onPrepare: async function (config, capabilities) {
    const { execSync } = require('child_process');
    const apkPath = process.env.APK_PATH || './app/app-release.apk';
    console.log('Installing APK:', apkPath);
    try {
      execSync(`adb install -r ${apkPath}`);
      console.log('APK installed successfully');
    } catch (e) {
      console.error('Failed to install APK:', e.message);
    }
  },
};
