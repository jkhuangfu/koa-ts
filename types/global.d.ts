import {hash, data_query, log4, redisDb, response} from '../src/util';

type HASH_TYPE = typeof hash;
type DATA_QUERY = typeof data_query;
type LOG4_TYPE = typeof log4;
type REDIS_DB = typeof redisDb;
type RES_TYPE = typeof response;
declare global {
    const encryption: HASH_TYPE;
    const DB: DATA_QUERY;
    const LOG4: LOG4_TYPE;
    const redisDb: REDIS_DB;
    const response: RES_TYPE;
}


