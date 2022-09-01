import * as Koa from 'koa';
import * as uuid from 'uuid';
import { getParams, response, Mysql, LOG4, encryption, redis, JsonWebToken, Session } from '@/util';

export default class UserController {
  public static async Login(ctx: Koa.Context) {
    const { userName, passWord, token } = getParams(ctx);
    const sql = `select id,wx_id,pass_word from tb_user where user_name = '${userName}'`;
    if (!userName || !passWord || !token) {
      return response(ctx, 201, { data: null }, '缺少参数');
    }
    const result: any = await Mysql.handle(sql, []);

    if (result.code === 500) {
      return response(ctx, 500, { data: null }, '信息查询失败');
    }

    const queryData = result.result;

    if (!queryData.length) {
      LOG4.http.info(userName, '用户名不存在');
      return response(ctx, 205, { data: null }, '账号信息错误');
    }

    const { wx_id, pass_word, id } = queryData[0];

    if (!wx_id) {
      return response(ctx, 203, { data: null }, '账号信息错误');
    }
    console.log(encryption.hash(passWord + '_drnet', 'md5'));
    if (pass_word !== encryption.hash(passWord + '_drnet', 'md5')) {
      return response(ctx, 204, { data: null }, '账号信息错误');
    }

    const tokenCode = await redis.get(wx_id + '_code');
    if (token !== tokenCode) {
      return response(ctx, 202, { data: null }, '令牌验证错误');
    }

    const generateTime = Date.now();
    const uid = uuid.v4();
    // 单点登录,删除之前存在redis里面的信息
    if (await redis.exits(id + '.jwt_token')) await redis.del(id + '.jwt_token');

    // 生成token信息
    const jToken = await JsonWebToken.generate({ userId: id, generateTime, uid });
    await redis.set(id + '.jwt_token', jToken, 7 * 24 * 60 * 60 * 1000);

    return response(ctx, 200, { data: jToken }, '登录成功');
  }

  public static async Register(ctx: Koa.Context) {
    const captach = Session.get(ctx, 'img');
    const { nickName, passWord, img } = getParams(ctx);
    if (!nickName || !passWord || !img) {
      return response(ctx, 400, { data: null }, '缺少参数');
    }
    if (captach !== img) {
      return response(ctx, 100, { data: null }, '验证码不正确');
    }
    const check = `select user_name from tb_user where user_name = '${nickName}'`;
    const insert = `insert into tb_user (user_name,reg_time,pass_word) values(?,now(),?)`;
    const checkIshasReg = await Mysql.handle(check, []);
    if (checkIshasReg.code === 500) {
      LOG4.http.error(JSON.stringify(checkIshasReg));
      return response(ctx, 500, { data: null }, '注册失败(查询)');
    }
    if (checkIshasReg.code === 200 && checkIshasReg.result.length) {
      return response(ctx, 201, { data: null }, '用户已存在');
    }
    const insertResult = await Mysql.handle(insert, [nickName, encryption.hash(passWord + '_drnet', 'md5')]);
    if (insertResult.code === 500) {
      LOG4.http.error(JSON.stringify(insertResult));
      return response(ctx, 500, { data: null }, '注册失败(插入)');
    }
    const generateTime = Date.now();
    const token = await JsonWebToken.generate({ userId: insertResult.result.insertId, generateTime, userName: nickName, uid: uuid.v4() });
    await redis.set(insertResult.result.insertId + '.jwt_token', token, 7 * 24 * 60 * 60 * 1000);
    return response(ctx, 200, { data: { Token: token } }, '注册成功');
  }
}
