import encryption from './crypto';
import DB from './dataquery';
import LOG4 from './log4js';
import redisDb from './redis';
import response from './response';
import Session from './session';
import JWT from './handle_jwt';
import $http from './http';
import getParams from './getParams';
export const globInit = () => {
  // global挂载全局方法
  Object.assign(global, { encryption, DB, LOG4, redisDb, response, Session, JWT, $http, getParams });
  return Promise.resolve();
};
