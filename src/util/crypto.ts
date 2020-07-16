import * as crypto from 'crypto';

export default class Encryption {
  /**
   * @description hash加密
   * @param {string} content 加密对象
   * @param {string} type 加密类型
   * @return {string} 加密后的值
   */
  public static hash(content: string, type: string) {
    const hash = crypto.createHash(type);
    hash.update(content);
    return hash.digest('hex');
  }

  /**
   * @description hmac加密
   * @param {string} content 加密对象
   * @param {string} type 加密类型
   * @param {string} secretkey 加密秘钥
   * @return {string} 加密后的值
   */
  public static hmac(content: string, type: string, secretkey: string) {
    const hmac = crypto.createHmac(type, secretkey);
    hmac.update(content);
    return hmac.digest('base64');
  }
}
