import * as Koa from 'koa';
import * as uuid from 'uuid';
const tvUser = {
  login: async (ctx: Koa.Context) => {
    const { user, pwd: password, token } = getParams(ctx);
    const sql = `select id,wx_id, pwd from tb_tv_user where user = '${user}'`;
    if (!user || !password || !token) {
      return response(ctx, 201, { data: null }, '缺少参数');
    }
    const result: any = await DB.handle(sql, []);
    if (result.code === 500) {
      return response(ctx, 500, { data: null }, '信息查询失败');
    }

    const { wx_id, pwd } = result.result[0];
    if (!wx_id || pwd !== password) {
      return response(ctx, 203, { data: null }, '账号信息错误');
    }

    const tokenCode = await redisDb.get(wx_id + '_code');
    if (token !== tokenCode) {
      return response(ctx, 202, { data: null }, '令牌验证错误');
    }

    const generateTime = Date.now();
    const uid = uuid.v4();
    const jToken: any = await JWT.generate({ g_t: generateTime, u_id: uid });
    return response(ctx, 200, { data: jToken }, '登录成功');
  },
  checkLogin: async (ctx: Koa.Context) => {
    const { authorization } = ctx.header;
    const user = authorization && (await JWT.verify(authorization.replace(/\"/g, '')));
    if (authorization && user) {
      return response(ctx, 200, { data: null }, '登录成功');
    } else {
      return response(ctx, 401, { data: null }, '未登录');
    }
  }
};

export default tvUser;
