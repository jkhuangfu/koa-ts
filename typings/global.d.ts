/// <reference types="node" />
import { MysqlError } from 'mysql';
import * as Koa from 'koa';
import { AxiosInstance } from 'axios';
import * as Log4js from 'log4js';

declare global {
  interface LOG4METHODS {
    app: Log4js.Logger;
    http: Log4js.Logger;
    error: Log4js.Logger;
    [key: string]: Log4js.Logger;
  }
  class encryption {
    /**
     * @description hash加密
     * @param {string} content 加密对象
     * @param {string} type 加密类型
     * @return {string} 加密后的值
     */
    static hash(content: string, type: string): string;
    /**
     * @description hmac加密
     * @param {string} content 加密对象
     * @param {string} type 加密类型
     * @param {string} secretkey 加密秘钥
     * @return {string} 加密后的值
     */
    static hmac(content: string, type: string, secretkey: string): string;
  }

  class DB {
    /**
     * @description 数据库操作方法
     * @param {string} sql sql操作语句
     * @param {any[]} query sql查询值
     * @returns {*} Promise<{code: number; msg?: MysqlError | string; result?: any}>
     */
    static handle(sql: string, query: any[]): Promise<{ code: number; msg?: MysqlError | string; result?: any }>;
  }

  class redisDb {
    /**
     * @description 设置键值对(原子性操作)
     * @param {string} key 键
     * @param {any} value 值
     * @param expire 过期时间（单位：秒，可为空，为空则不过期）
     * @return 0 代表插入成功 1 代表已经存在该key值
     */
    public static setnx(key: string, value: any, expire?: number): Promise<number | Error>;

    /**
     * @description 设置键值对
     * @param {string} key 键
     * @param {any} value 值
     * @param expire 过期时间（单位：秒，可为空，为空则不过期）
     * @return 200 代表成功其他代表失败
     */
    public static set(key: string, value: any, expire?: number): Promise<number | Error>;
    /**
     * @description 获取对应value
     * @param key 键
     * @return Promise<string | boolean | null>
     */
    static get(key: string): Promise<string | boolean | null>;

    /**
     * @description 判断是否存在该key
     * @param key
     * @return true代表存在否则不存在 Promise<Boolean>
     */

    static exits(key: string): Promise<boolean>;

    /**
     * @description 根据key值删除数据
     * @param keys 要删除的key 单个为String 多个为Array[key1,key2]
     * @return Promise<Boolean>
     */

    static del(keys: string | string[]): Promise<boolean>;

    /**
     * @description 设置hash类型
     * @param key 键
     * @param args 值
     * @param expire 过期时间（单位：秒，可为空，为空则不过期）
     * @return 200 代表成功其他代表失败
     */
    static hmset(key: string, ...args: any[]): Promise<number | Error>;
    /**
     * @description 查询所有的hash值
     * @param {string} key
     * @returns Promise<boolean |  {[key: string]: string;}>
     */
    static hgetall(key: string): Promise<boolean | { [key: string]: string }>;

    /**
     * @description 查询所有的hash值中field对应的具体值
     * @param {string} key
     * @returns Promise<boolean | string}>
     */
    static hget(key: string, field: string): Promise<string | boolean>;

    /**
     * @description 删除hash中的对应list
     * @param {string} key
     * @returns 200代表删除成功否则失败 Promise<boolean | number>
     */
    static hdel(key: string, field: string): Promise<number | boolean>;
  }

  /**
   * 返回值封装
   *
   * @export
   * @param {Koa.Context} ctx
   * @param {number} status
   * @param {any} data
   * @param {string} msg
   */
  function response(ctx: Koa.Context, status: number, result?: { data: any }, msg?: string): void;

  /**
   * @description session处理
   * @function set 设置session
   * @function get 获取session
   * @function delete 删除session
   */
  class Session {
    public static set(ctx: Koa.Context, key: string, value: any, age: number): void;
    public static get(ctx: Koa.Context, key: string): string | null;
    public static delete(ctx: Koa.Context, key: string): void;
  }

  class JWT {
    /**
     * @description  token生成方法
     * @param {string | object | Buffer} value 加密对象
     * @param {string} [secret='^@q676V_8&2'] token加密秘钥
     * @param {string} [expires='7 days'] 生成的token有效期默认一周
     * @return {string | boolean | undefined} 返回Promise对象(生成的token 失败返回false)
     */
    static generate(value: string | object | Buffer, secret?: string, expires?: string): Promise<string | boolean | undefined>;
    /**
     * @description  验证token是否有效的方法
     * @param {string} token 需要验证的token
     * @param {string} [secret='^@q676V_8&2'] token加密秘钥
     * @return {object | string | boolean} 返回Promise对象(token解密成功的值,失败返回false)
     */
    static verify(token: string, secret?: string): Promise<object | string | boolean>;
  }

  function getParams(ctx: Koa.Context): { [key: string]: any };

  const $http: AxiosInstance;

  const LOG4: LOG4METHODS;
}
