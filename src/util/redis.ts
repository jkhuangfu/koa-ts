import * as redis from 'redis';
import { configDev, configProd } from '@/config/redis';

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

export default class RedisDb {
  /**
   * @description 设置键值对
   * @param {string} key 键
   * @param {any} value 值
   * @param expire 过期时间（单位：秒，可为空，为空则不过期）
   * @return 200 代表成功其他代表失败
   */
  public static set(key: string, value: any, expire?: number): Promise<number | Error> {
    return new Promise((resolve: (value: number | Error) => void) => {
      client.set(key, value, (err: Error | null) => {
        if (err) {
          LOG4.http.error('redis插入(set)失败：' + err);
          return resolve(err);
        }
        if (expire && expire > 0) {
          client.expire(key, expire);
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
  public static get(key: string): Promise<string | boolean | null> {
    return new Promise((resolve: (value: string | boolean | null) => void) => {
      client.get(key, (err, result) => {
        if (err) {
          LOG4.http.error('redis获取失败：' + err);
          return resolve(false);
        }
        resolve(result);
      });
    });
  }

  /**
   * @description 判断是否存在该key
   * @param key
   * @return true代表存在否则不存在 Promise<Boolean>
   */

  public static exits(key: string): Promise<boolean> {
    return new Promise((resolve: (value: boolean) => void) => {
      client.exists(key, (err, reply) => {
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

  public static del(keys: string | string[]) {
    return new Promise((resolve: (value: boolean) => void) => {
      client.del(keys, (err, val) => {
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
  public static hmset(key: string, ...args: any[]): Promise<number | Error> {
    return new Promise((resolve: (value: number | Error) => void) => {
      client.hmset(key, ...args, (error, ressult) => {
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
  public static hgetall(
    key: string
  ): Promise<
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
        client.hgetall(key, (error, result) => {
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
  public static hget(key: string, field: string): Promise<string | boolean> {
    return new Promise((resolve: (value: boolean | string) => void) => {
      client.hget(key, field, (error, result) => {
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
  public static hdel(key: string, field: string): Promise<number | boolean> {
    return new Promise((resolve: (value: number | boolean) => void) => {
      client.hdel(key, field, error => {
        if (error) return resolve(false);
        resolve(200);
      });
    });
  }
}
