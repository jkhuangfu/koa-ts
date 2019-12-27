import * as Log4js from 'log4js';
interface LOG4 {
  [key: string]: Log4js.Logger;
}
Log4js.configure({
  appenders: {
    ruleConsole: { type: 'console' },
    app: {
      type: 'dateFile',
      filename: '../logs/app',
      pattern: 'yyyy-MM-dd.log',
      maxLogSize: 10 * 1000 * 1000,
      numBackups: 3,
      alwaysIncludePattern: true
    },
    http: {
      type: 'dateFile',
      filename: '../logs/http',
      pattern: 'yyyy-MM-dd.log',
      maxLogSize: 10 * 1000 * 1000,
      numBackups: 3,
      alwaysIncludePattern: true
    },
    error: {
      type: 'dateFile',
      filename: '../logs/error',
      pattern: 'yyyy-MM-dd.log',
      maxLogSize: 10 * 1000 * 1000,
      numBackups: 3,
      alwaysIncludePattern: true,
      appender: 'error',
      level: 'error'
    }
  },
  pm2: true,
  categories: {
    app: { appenders: ['app'], level: 'all' },
    http: { appenders: ['http'], level: 'all' },
    error: { appenders: ['error'], level: 'error' },
    default: { appenders: ['ruleConsole'], level: 'all' }
  }
});
const log4: LOG4 = {};
log4.app = Log4js.getLogger('app');
log4.http = Log4js.getLogger('http');
log4.error = Log4js.getLogger('error');
export default log4;
