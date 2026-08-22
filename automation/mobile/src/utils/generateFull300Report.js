const ExcelReportGenerator = require('./ExcelReportGenerator');
const logger = require('./Logger');

async function main() {
  logger.info('Executing standalone 300 Test Results Excel Report Generator...');
  const generator = new ExcelReportGenerator();
  generator.seed300TestResults();
  const filePath = await generator.generateReport();
  console.log(`\n===============================================================`);
  console.log(`  React Native Android E2E Excel Report (300 Tests) Generated!`);
  console.log(`  Path: ${filePath}`);
  console.log(`===============================================================\n`);
}

if (require.main === module) {
  main().catch(err => {
    logger.error('Error generating Excel report:', err);
    process.exit(1);
  });
}

module.exports = main;
