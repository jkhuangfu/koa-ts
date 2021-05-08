import { createDecipheriv } from 'crypto';

export default class WxBizDataCrypt {
  private appId: string;

  private sessionKey: string;

  private encryptedData: string;

  private iv: string;

  constructor(appId: string, sessionKey: string, encryptedData: string, iv: string) {
    this.appId = appId;
    this.sessionKey = sessionKey;
    this.encryptedData = encryptedData;
    this.iv = iv;
  }

  public decryptData() {
    const sessionKey = Buffer.from(this.sessionKey, 'base64');
    const encryptedDataBuffer = Buffer.from(this.encryptedData, 'base64').toString();
    const ivBuffer = Buffer.from(this.iv, 'base64');
    let decoded: any;
    try {
      // 解密
      const decipher = createDecipheriv('aes-128-cbc', sessionKey, ivBuffer);
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true);
      decoded = decipher.update(encryptedDataBuffer, 'binary', 'utf8');
      decoded += decipher.final('utf8');
      decoded = JSON.parse(decoded);
    } catch (err) {
      throw new Error('Illegal Buffer');
    }

    if (decoded.watermark.appid !== this.appId) {
      throw new Error('Illegal Buffer');
    }

    return decoded;
  }
}
