const winston = require('winston')
const { format } = require('winston');
const { combine, timestamp, label, printf } = format;
require('winston-daily-rotate-file')

/**
 * log file directory is at : ./log/
 * 
 */

const level = process.env.LOG_LEVEL || 'debug';

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});


const logger = winston.createLogger({
  level: level,
  format: combine(
    label({ label: 'service' }),
    timestamp(),
    myFormat,
    format.splat()
  ),
  defaultMeta: 'user-service',
  transports: [
    new winston.transports.DailyRotateFile({
      filename: './logs/%DATE%.error.log',
      level: 'error',
      datePattern: 'yyyy_MM_dd',
      maxFiles: 21
    }),
    new winston.transports.DailyRotateFile({
      filename: './logs/%DATE%.combined.log',
      datePattern: 'yyyy_MM_dd',
      maxFiles: 21,
    })

  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      label({ label: 'service1' }),
      timestamp(),
      myFormat
    ),
  }))
}


module.exports = logger
