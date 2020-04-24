import { encryption, DB, LOG4, redisDb, response, Session, JWT, $http } from '../src/util';

type HASH_TYPE = typeof encryption;
type DATA_QUERY = typeof DB;
type LOG4_TYPE = typeof LOG4;
type REDIS_DB = typeof redisDb;
type RES_TYPE = typeof response;
type SESSION = typeof Session;
type JWT_TYPE = typeof JWT;
type HTTP = typeof $http;

declare global {
  const encryption: HASH_TYPE;
  const DB: DATA_QUERY;
  const LOG4: LOG4_TYPE;
  const redisDb: REDIS_DB;
  const response: RES_TYPE;
  const Session: SESSION;
  const JWT: JWT_TYPE;
  const $http: HTTP;
}
