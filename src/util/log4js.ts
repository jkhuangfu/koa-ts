import * as Log4js from 'log4js';

Log4js.configure({
  appenders: {
    stdout: {
      // 控制台输出
      type: 'stdout'
    },
    app: {
      type: 'dateFile',
      filename: '../logs/app',
      pattern: 'yyyy-MM-dd-hh.log',
      maxLogSize: 10 * 1000 * 1000,
      numBackups: 3,
      alwaysIncludePattern: true
    },
    http: {
      type: 'dateFile',
      filename: '../logs/http',
      pattern: 'yyyy-MM-dd-hh.log',
      maxLogSize: 10 * 1000 * 1000,
      numBackups: 3,
      alwaysIncludePattern: true
    },
    error: {
      type: 'dateFile',
      filename: '../logs/error',
      pattern: 'yyyy-MM-dd-hh.log',
      maxLogSize: 10 * 1000 * 1000,
      numBackups: 3,
      alwaysIncludePattern: true,
      appender: 'error',
      level: 'error'
    }
  },
  pm2: true,
  disableClustering: true,
  categories: {
    default: { appenders: ['stdout'], level: 'all' },
    app: { appenders: ['stdout', 'app'], level: 'all' },
    http: { appenders: ['stdout', 'http'], level: 'all' },
    error: { appenders: ['stdout', 'error'], level: 'error' }
  }
});
const log4 = {
  app: Log4js.getLogger('app'),
  http: Log4js.getLogger('http'),
  error: Log4js.getLogger('error')
};

export default log4;
