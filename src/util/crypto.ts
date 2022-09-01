import * as crypto from 'crypto';
import LOG4 from './log4js';

interface Encryption {
  /**
   * @description hash加密
   * @param {string} content 加密对象
   * @param {string} type 加密类型
   * @return {string} 加密后的值
   */
  hash(content: string, type: string): string;
  /**
   * @description hmac加密
   * @param {string} content 加密对象
   * @param {string} type 加密类型
   * @param {string} secretkey 加密秘钥
   * @return {string} 加密后的值
   */
  hmac(content: string, type: string, secretkey: string): string;
  /**
   * @description aes-128-cbc对称 加密
   * @param dataStr 加密内容{string}
   * @param key 加密秘钥{string | Buffer}长度为16位
   * @param iv 偏移量{string | Buffer}长度为16位
   * @return {string|boolean} 加密后的值
   */
  cipher(dataStr: string, key: string | Buffer, iv: string | Buffer): string | boolean;
  /**
   * @description aes-128-cbc对称 解密
   * @param dataStr  {string} 解密对象
   * @param key 加密秘钥 {string | Buffer}长度为16位
   * @param iv 偏移量 {string | Buffer}长度为16位
   * @return {string|boolean} 解密结果(boolean值为解密失败false)
   */
  decipher(dataStr: string, key: string | Buffer, iv: string | Buffer): string | boolean;
}

export class EncryptionImpl implements Encryption {
  hash(content: string, type: string): string {
    const hash = crypto.createHash(type);
    hash.update(content);
    return hash.digest('hex');
  }

  hmac(content: string, type: string, secretkey: string): string {
    const hmac = crypto.createHmac(type, secretkey);
    hmac.update(content);
    return hmac.digest('base64');
  }

  decipher(dataStr: string, key: string | Buffer, iv: string | Buffer): string | boolean {
    try {
      const cipherChunks = [];
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      decipher.setAutoPadding(true);
      cipherChunks.push(decipher.update(dataStr, 'base64', 'utf8'));
      cipherChunks.push(decipher.final('utf8'));
      return cipherChunks.join('');
    } catch (e) {
      LOG4.app.error('解密失败：', e);
      return false;
    }
  }

  cipher(dataStr: string, key: string | Buffer, iv: string | Buffer): string | boolean {
    try {
      const cipherChunks = [];
      const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
      cipher.setAutoPadding(true);
      cipherChunks.push(cipher.update(dataStr, 'utf8', 'base64'));
      cipherChunks.push(cipher.final('base64'));
      return cipherChunks.join('');
    } catch (e) {
      LOG4.app.error('加密失败：', e);
      return false;
    }
  }
}

export default new EncryptionImpl();
