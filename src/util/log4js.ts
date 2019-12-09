import {configure, getLogger} from 'log4js';
configure({
    appenders: {
        ruleConsole: { type: 'console' },
        app: {
            type: 'dateFile',
            filename: '../logs/server-',
            pattern: 'yyyy-MM-dd.log',
            maxLogSize: 10 * 1000 * 1000,
            numBackups: 3,
            alwaysIncludePattern: true
        }
    },
    pm2: true,
    categories: {
        default: { appenders: ['app'], level: 'debug' }
    }
});
const log4 = getLogger('app');

export default log4;
