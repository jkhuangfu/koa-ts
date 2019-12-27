import * as crypto from 'crypto';

export default class Encryption {
  public static hash(content: string, type: string) {
    const hash = crypto.createHash(type);
    hash.update(content);
    return hash.digest('hex');
  }
}
