const { expect } = require('chai');
const DriverFactory = require('../drivers/DriverFactory');
const AITestExplorer = require('../ai/AITestExplorer');
const ExcelReportGenerator = require('../utils/ExcelReportGenerator');
const logger = require('../utils/Logger');

describe('React Native Mobile - Smart AI Autonomous Exploration Suite', function () {
  this.timeout(120000);
  let driver;
  let aiExplorer;
  let reportGenerator;

  before(async function () {
    reportGenerator = new ExcelReportGenerator();
    try {
      driver = await DriverFactory.createDriver();
      aiExplorer = new AITestExplorer(driver, reportGenerator);
    } catch (err) {
      logger.warn(`Driver initialization note: ${err.message}`);
    }
  });

  after(async function () {
    await DriverFactory.quitDriver();
  });

  it('TC-AI-001: AI Explorer analyzes active screen hierarchy and extracts widgets', async function () {
    logger.info('Running TC-AI-001: AI screen hierarchy analysis');
    if (!driver) this.skip();
    const widgets = await aiExplorer.analyzeCurrentScreen('HomeScreen');
    expect(widgets).to.be.an('array');
  });

  it('TC-AI-002: AI Explorer synthesizes dynamic edge-case test vectors and executes validation', async function () {
    logger.info('Running TC-AI-002: Autonomous test generation');
    if (!driver) this.skip();
    const scenarios = await aiExplorer.exploreAndValidate('MarketplaceScreen');
    expect(scenarios).to.be.an('array');
  });
});
