import * as redis from 'redis';
import { configDev, configProd } from '@/config/redis';
import LOG4 from './log4js';
const { NODE_ENV } = process.env;
const { ip, port, password } = NODE_ENV === 'development' ? configDev : configProd;
const client: redis.RedisClient = redis.createClient(port, ip, password ? { password } : {});
client.on('error', (err: Error) => {
  LOG4.app.error('redis error：' + err);
  process.exit(1);
});
client.on('connect', () => {
  LOG4.app.info('redis连接成功...');
});

interface RedisDb {
  /**
   * @description 设置键值对(原子性操作)
   * @param {string} key 键
   * @param {any} value 值
   * @param expire 过期时间（单位：秒，可为空，为空则不过期）
   * @return 0 代表插入成功 1 代表已经存在该key值
   */
  setnx(key: string, value: any, expire?: number): Promise<number | Error>;

  /**
   * @description 设置键值对
   * @param {string} key 键
   * @param {any} value 值
   * @param expire 过期时间（单位：秒，可为空，为空则不过期）
   * @return 200 代表成功其他代表失败
   */
  set(key: string, value: any, expire?: number): Promise<number | Error>;
  /**
   * @description 获取对应value
   * @param key 键
   * @return Promise<string | boolean | null>
   */
  get(key: string): Promise<string | boolean | null>;

  /**
   * @description 判断是否存在该key
   * @param key
   * @return true代表存在否则不存在 Promise<Boolean>
   */

  exits(key: string): Promise<boolean>;

  /**
   * @description 根据key值删除数据
   * @param keys 要删除的key 单个为String 多个为Array[key1,key2]
   * @return Promise<Boolean>
   */

  del(keys: string | string[]): Promise<boolean>;

  /**
   * @description 设置hash类型
   * @param key 键
   * @param args 值
   * @param expire 过期时间（单位：秒，可为空，为空则不过期）
   * @return 200 代表成功其他代表失败
   */
  hmset(key: string, ...args: any[]): Promise<number | Error>;
  /**
   * @description 查询所有的hash值
   * @param {string} key
   * @returns Promise<boolean |  {[key: string]: string;}>
   */
  hgetall(key: string): Promise<boolean | { [key: string]: string }>;

  /**
   * @description 查询所有的hash值中field对应的具体值
   * @param {string} key
   * @returns Promise<boolean | string}>
   */
  hget(key: string, field: string): Promise<string | boolean>;

  /**
   * @description 删除hash中的对应list
   * @param {string} key
   * @returns 200代表删除成功否则失败 Promise<boolean | number>
   */
  hdel(key: string, field: string): Promise<number | boolean>;
}

export class RedisDbImpl implements RedisDb {
  private client: redis.RedisClient;

  constructor() {
    this.client = client;
  }

  /**
   * @description 设置键值对(原子性操作)
   * @param {string} key 键
   * @param {any} value 值
   * @param expire 过期时间（单位：秒，可为空，为空则不过期）
   * @return 0 代表插入成功 1 代表已经存在该key值
   */
  setnx(key: string, value: any, expire?: number): Promise<number | Error> {
    return new Promise((resolve: (value: number | Error) => void) => {
      this.client.setnx(key, value, (err: Error | null, replay: number) => {
        if (err) {
          LOG4.http.error('redis插入(setnx)失败：' + err);
          return resolve(err);
        }
        if (expire && expire > 0) {
          this.client.expire(key, expire);
        }
        resolve(replay);
      });
    });
  }

  /**
   * @description 设置键值对
   * @param {string} key 键
   * @param {any} value 值
   * @param expire 过期时间（单位：秒，可为空，为空则不过期）
   * @return 200 代表成功其他代表失败
   */
  set(key: string, value: any, expire?: number): Promise<number | Error> {
    return new Promise((resolve: (value: number | Error) => void) => {
      this.client.set(key, value, (err: Error | null) => {
        if (err) {
          LOG4.http.error('redis插入(set)失败：' + err);
          return resolve(err);
        }
        if (expire && expire > 0) {
          this.client.expire(key, expire);
        }
        resolve(200);
      });
    });
  }

  /**
   * @description 获取对应value
   * @param key 键
   * @return Promise<string | boolean | null>
   */
  get(key: string): Promise<string> {
    return new Promise((resolve: (value: string) => void) => {
      this.client.get(key, (err, result) => {
        if (err) {
          LOG4.http.error('redis获取失败：' + err);
          return resolve('');
        }
        resolve(result || '');
      });
    });
  }

  /**
   * @description 判断是否存在该key
   * @param key
   * @return true代表存在否则不存在 Promise<Boolean>
   */

  exits(key: string): Promise<boolean> {
    return new Promise((resolve: (value: boolean) => void) => {
      this.client.exists(key, (err, reply) => {
        if (err) {
          LOG4.http.error('redis检查出错，', err);
          return resolve(false);
        }
        if (reply === 1) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      });
    });
  }

  /**
   * @description 根据key值删除数据
   * @param keys 要删除的key 单个为String 多个为Array[key1,key2]
   * @return Promise<Boolean>
   */

  del(keys: string | string[]) {
    return new Promise((resolve: (value: boolean) => void) => {
      this.client.del(keys, (err, val) => {
        if (err) {
          resolve(false);
        } else if (val >= 1) {
          resolve(true);
        }
      });
    });
  }

  /**
   * @description 设置hash类型
   * @param key 键
   * @param args 值
   * @param expire 过期时间（单位：秒，可为空，为空则不过期）
   * @return 200 代表成功其他代表失败
   */
  hmset(key: string, ...args: any[]): Promise<number | Error> {
    return new Promise((resolve: (value: number | Error) => void) => {
      this.client.hmset(key, ...args, (error, ressult) => {
        if (error) {
          LOG4.http.error('redis插入(hmset)失败：' + error);
          return resolve(error);
        }
        resolve(200);
      });
    });
  }
  /**
   * @description 查询所有的hash值
   * @param {string} key
   * @returns Promise<boolean |  {[key: string]: string;}>
   */
  hgetall(key: string): Promise<
    | boolean
    | {
        [key: string]: string;
      }
  > {
    return new Promise(
      (
        resolve: (
          value:
            | boolean
            | {
                [key: string]: string;
              }
        ) => void
      ) => {
        this.client.hgetall(key, (error, result) => {
          if (error) return resolve(false);
          resolve(result);
        });
      }
    );
  }

  /**
   * @description 查询所有的hash值中field对应的具体值
   * @param {string} key
   * @returns Promise<boolean | string}>
   */
  hget(key: string, field: string): Promise<string | boolean> {
    return new Promise((resolve: (value: boolean | string) => void) => {
      this.client.hget(key, field, (error, result) => {
        if (error) return resolve(false);
        console.log(key, field, error, result);
        resolve(result);
      });
    });
  }

  /**
   * @description 删除hash中的对应list
   * @param {string} key
   * @returns 200代表删除成功否则失败 Promise<boolean | number>
   */
  hdel(key: string, field: string): Promise<number | boolean> {
    return new Promise((resolve: (value: number | boolean) => void) => {
      this.client.hdel(key, field, error => {
        if (error) return resolve(false);
        resolve(200);
      });
    });
  }
}

export default new RedisDbImpl();
