import * as Log4js from 'log4js';
interface LOG4_METHODS {
  [key: string]: Log4js.Logger;
}
Log4js.configure({
  appenders: {
    stdout: {// 控制台输出
      type: 'stdout'
    },
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
    default: { appenders: ['stdout'], level: 'all' },
    app: { appenders: ['stdout','app'], level: 'all' },
    http: { appenders: ['stdout','http'], level: 'all' },
    error: { appenders: ['stdout','error'], level: 'error' },
  }
});
const log4: LOG4_METHODS = {};
log4.app = Log4js.getLogger('app');
log4.http = Log4js.getLogger('http');
log4.error = Log4js.getLogger('error');
export default log4;
