import * as Koa from 'koa';
import * as uuid from 'uuid';

interface UserController {
  Login: (ctx: Koa.Context) => Promise<any>;
  Register: (ctx: Koa.Context) => Promise<any>;
}

const userController: UserController = {
  Login: async (ctx: Koa.Context) => {
    const { userName, pwd, token } = ctx.request.body;
    const sql = `select wx_id,pass_word from tb_user where user_name = '${userName}'`;
    if (!userName || !pwd || !token) {
      return response(ctx, 201, { data: null }, '缺少参数');
    }
    const result: any = await DB.handle(sql, []);
    if (result.code === 500) {
      return response(ctx, 500, { data: null }, '信息查询失败');
    }
    const { wx_id, pass_word } = result.result[0];

    if (!wx_id) {
      return response(ctx, 203, { data: null }, '账号信息错误');
    }
    if (pass_word !== encryption.hash(pwd + '_drnet', 'md5')) {
      return response(ctx, 204, { data: null }, '账号信息错误');
    }
    const tokenCode = await redisDb.get(wx_id + '_code');
    if (token !== tokenCode) {
      return response(ctx, 202, { data: null }, '令牌验证错误');
    }

    const generateTime = Date.now();
    const uid = uuid.v4();
    if (await redisDb.exits(userName + '.Token')) await redisDb.del(userName + '.Token');
    await redisDb.set(userName + '.Token', userName + uid, 7 * 24 * 60 * 60 * 1000);
    const jToken = await JWT.generate({ userId: userName, g_t: generateTime, u_id: uid });
    return response(ctx, 200, { data: jToken }, '登录成功');
  },
  Register: async (ctx: Koa.Context) => {
    const captach = Session.get(ctx, 'img');
    const { nickName, passWord, img } = ctx.request.body;
    if (!nickName || !passWord || !img) {
      response(ctx, 400, { data: null }, '缺少参数');
      return;
    }
    if (captach !== img) {
      response(ctx, 100, { data: null }, '验证码不正确');
      return;
    }
    const check = `select user_name from tb_user where user_name = '${nickName}'`;
    const insert = `insert into tb_user (user_name,reg_time,pass_word) values(?,now(),?)`;
    const checkIshasReg = await DB.handle(check, []);
    if (checkIshasReg.code === 500) {
      response(ctx, 500, { data: null }, '注册失败(查询)');
      return;
    }
    if (checkIshasReg.code === 200 && checkIshasReg.result.length) {
      response(ctx, 201, { data: null }, '用户已存在');
      return;
    }
    const insertResult = await DB.handle(insert, [nickName, encryption.hash(passWord + '_drnet', 'md5')]);
    if (insertResult.code === 500) {
      response(ctx, 500, { data: null }, '注册失败(插入)');
      return;
    }
    const generateTime = Date.now();
    await redisDb.set(nickName + '.Token', nickName, 7 * 24 * 60 * 60 * 1000);
    const token = await JWT.generate({ userId: nickName, g_t: generateTime });
    response(ctx, 200, { data: { Token: token } }, '注册成功');
  }
};

export default userController;
