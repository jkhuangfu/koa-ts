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
    const encryptedDataBuffer = Buffer.from(this.encryptedData, 'base64');
    const ivBuffer = Buffer.from(this.iv, 'base64');
    let decoded: any;
    try {
      // 解密
      const decipher = createDecipheriv('aes-128-cbc', sessionKey, ivBuffer);
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true);
      decoded = decipher.update(encryptedDataBuffer, undefined, 'utf8');
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

// const appId = 'wx4f4bc4dec97d474b';
// const sessionKey = 'tiihtNczf5v6AKRyjwEUhQ==';
// const encryptedData =
//   'CiyLU1Aw2KjvrjMdj8YKliAjtP4gsMZM' +
//   'QmRzooG2xrDcvSnxIMXFufNstNGTyaGS' +
//   '9uT5geRa0W4oTOb1WT7fJlAC+oNPdbB+' +
//   '3hVbJSRgv+4lGOETKUQz6OYStslQ142d' +
//   'NCuabNPGBzlooOmB231qMM85d2/fV6Ch' +
//   'evvXvQP8Hkue1poOFtnEtpyxVLW1zAo6' +
//   '/1Xx1COxFvrc2d7UL/lmHInNlxuacJXw' +
//   'u0fjpXfz/YqYzBIBzD6WUfTIF9GRHpOn' +
//   '/Hz7saL8xz+W//FRAUid1OksQaQx4CMs' +
//   '8LOddcQhULW4ucetDf96JcR3g0gfRK4P' +
//   'C7E/r7Z6xNrXd2UIeorGj5Ef7b1pJAYB' +
//   '6Y5anaHqZ9J6nKEBvB4DnNLIVWSgARns' +
//   '/8wR2SiRS7MNACwTyrGvt9ts8p12PKFd' +
//   'lqYTopNHR1Vf7XjfhQlVsAJdNiKdYmYV' +
//   'oKlaRv85IfVunYzO0IKXsyl7JCUjCpoG' +
//   '20f0a04COwfneQAGGwd5oa+T8yO5hzuy' +
//   'Db/XcxxmK01EpqOyuxINew==';
// const iv = 'r7BXXKkLb8qrSNn05n0qiA==';

// const t = new WxBizDataCrypt(appId, sessionKey, encryptedData, iv);
// const r = t.decryptData();
// console.log(r);
