import { hash, data_query, log4, redisDb, response, Session, JWT } from '../src/util';

type HASH_TYPE = typeof hash;
type DATA_QUERY = typeof data_query;
type LOG4_TYPE = typeof log4;
type REDIS_DB = typeof redisDb;
type RES_TYPE = typeof response;
type SESSION = typeof Session;
type JWT_TYPE = typeof JWT;

declare global {
  const encryption: HASH_TYPE;
  const DB: DATA_QUERY;
  const LOG4: LOG4_TYPE;
  const redisDb: REDIS_DB;
  const response: RES_TYPE;
  const Session: SESSION;
  const JWT: JWT_TYPE;
}
