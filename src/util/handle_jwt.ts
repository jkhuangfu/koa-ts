import * as jwt from 'jsonwebtoken';

export default class JWT {
  public static async generate(value: any, secret: string = '^@q676V_8&2', expires: number = 60 * 60) {
    try {
      return jwt.sign(value, secret, { expiresIn: expires });
    } catch (e) {
      LOG4.http.error('jwt sign error --->', e);
      return false;
    }
  }
  public static async verify(token: string, secret: string = '^@q676V_8&2') {
    try {
      return jwt.verify(token, secret);
    } catch (e) {
      LOG4.http.error('jwt verify error --->', e);
      return false;
    }
  }
}
