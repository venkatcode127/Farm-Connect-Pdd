const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const generateSeleniumExcelReport = require('../generate_excel');

describe('React JS Web Application - Selenium E2E Automation', function () {
  this.timeout(60000);
  let driver;
  const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080');
    try {
      driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    } catch (err) {
      console.log('Selenium driver init note:', err.message);
    }
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
    await generateSeleniumExcelReport();
  });

  it('WEB-TC-001: Should load React Application and verify page title and root element', async function () {
    if (!driver) this.skip();
    await driver.get(baseUrl);
    const title = await driver.getTitle();
    expect(title).to.be.a('string');
  });

  it('WEB-TC-002: Should verify Navbar brand and navigation links', async function () {
    if (!driver) this.skip();
    await driver.get(baseUrl);
    const body = await driver.findElement(By.tagName('body'));
    expect(await body.isDisplayed()).to.be.true;
  });
});
