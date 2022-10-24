import * as winston from 'winston';
import 'winston-daily-rotate-file';
import Subscriber from '../subscriber';

export default class Logger extends Subscriber {
  private logger: winston.Logger;
  constructor() {
    super();

    const loggers = [];
    if (process.env.LOG_TYPE === 'console') {
      loggers.push(new winston.transports.Console());
    } else if (process.env.LOG_TYPE === 'file') {
      loggers.push(
        new winston.transports.DailyRotateFile({
          filename: './logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        })
      );

      loggers.push(
        new winston.transports.DailyRotateFile({
            filename: './logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
          })
      );
    }

    this.logger = winston.createLogger({
      format: winston.format.json(),
      transports: loggers,
      exitOnError: false,
    });
  }

  events(): string[] {
    return ['*'];
  }
  handler(event: string, data: any): Promise<void> {
    if (event.includes('fail')) {
      this.logger.log('error', {type: event, data});
    } else {
      this.logger.log('info', {type: event, data});
    }
    return Promise.resolve();
  }
}
