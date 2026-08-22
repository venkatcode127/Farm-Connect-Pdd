const winston = require('winston');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

// Ensure log directories exist
if (!fs.existsSync(config.logsDir)) {
  fs.mkdirSync(config.logsDir, { recursive: true });
}

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      )
    }),
    new winston.transports.File({
      filename: path.join(config.logsDir, 'appium-execution.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(config.logsDir, 'failures.log'),
      level: 'error'
    })
  ]
});

module.exports = logger;
