import hash from './crypto';
import data_query from './dataquery';
import log4 from './log4js';
import redisDb from './redis';
import response from './response';
import Session from './session';
import JWT from './handle_jwt';
const globInit = async () => {
  // global挂载全局方法
  Object.assign(global, { encryption: hash, DB: data_query, LOG4: log4, redisDb, response, Session, JWT });
};
export { hash, data_query, log4, globInit, redisDb, response, Session, JWT };
