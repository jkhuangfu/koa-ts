import * as jwt from 'jsonwebtoken';
import { resolve } from 'path';

export default class JWT {
  /**
   * @description  token生成方法
   * @param {string | object | Buffer} value 加密对象
   * @param {string} [secret='^@q676V_8&2'] token加密秘钥
   * @param {string} [expires='7 days'] 生成的token有效期
   * @return {string | boolean} 返回Promise对象(生成的token 失败返回false)
   */
  public static async generate(
    value: string | object | Buffer,
    secret: string = '^@q676V_8&2',
    expires: string = '7 days'
  ): Promise<string | boolean | undefined> {
    try {
      return new Promise((res: (value: string | boolean | undefined) => void) => {
        jwt.sign(value, secret, { expiresIn: expires }, (e, encode) => {
          if (e) {
            return res(false);
          }
          return res(encode);
        });
      });
    } catch (e) {
      LOG4.http.error('jwt sign error --->', e);
      return false;
    }
  }
  /**
   * @description  验证token是否有效的方法
   * @param {string} token 需要验证的token
   * @param {string} [secret='^@q676V_8&2'] token加密秘钥
   * @return {object | string | boolean} 返回Promise对象(token解密成功的值,失败返回false)
   */
  public static async verify(token: string, secret: string = '^@q676V_8&2'): Promise<object | string | boolean | undefined> {
    try {
      return new Promise((res: (value: object | string | boolean | undefined) => void) => {
        jwt.verify(token, secret, (error, result) => {
          if (error) {
            return res(false);
          }
          res(result);
        });
      });
    } catch (e) {
      LOG4.http.error('jwt verify error --->', e);
      return false;
    }
  }
}
