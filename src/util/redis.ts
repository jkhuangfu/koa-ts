import * as redis from 'redis';
import { configDev, configProd } from '@/config/redis';

const { NODE_ENV } = process.env;
const { ip, port } = NODE_ENV === 'development' ? configDev : configProd;
const client: redis.RedisClient = redis.createClient(port, ip);
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
   * @param key 键
   * @param value 值
   * @param expire 过期时间（单位：秒，可为空，为空则不过期）
   * @return 200
   */
  public static set(key: string, value: any, expire?: number): Promise<number | Error> {
    return new Promise((resolve: (value: number | Error) => void) => {
      client.set(key, value, (err: Error | null) => {
        if (err) {
          LOG4.http.error('redis插入失败：' + err);
          resolve(err);
          return false;
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
   * @return Promise<Any>
   */
  public static get(key: string): Promise<string | Error | null> {
    return new Promise((resolve: (value: string | Error | null) => void) => {
      client.get(key, (err, result) => {
        if (err) {
          LOG4.http.error('redis获取失败：' + err);
          resolve(err);
          return false;
        }
        resolve(result);
      });
    });
  }

  /**
   * @description 判断是否存在该key
   * @param key
   * @return Promise<Boolean>
   */

  public static exits(key: string): Promise<boolean> {
    return new Promise((resolve: (value: boolean) => void) => {
      client.exists(key, (err, reply) => {
        if (err) {
          LOG4.http.error('redis检查出错，', err);
          resolve(false);
          return false;
        }
        if (reply === 1) {
          resolve(true);
        } else {
          resolve(false);
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
}
