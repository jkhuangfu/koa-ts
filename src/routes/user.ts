import * as Router from 'koa-router';
import * as Koa from 'koa';
import jwtCheck from '../middleware/checklogin';
import * as uuid from 'uuid';
const router = new Router<Koa.DefaultContext, Koa.Context>();
router
  .prefix('/user')
  .post('/login', async (ctx: Koa.Context) => {
    const { userName, pwd } = ctx.request.body;
    if (userName === 'admin' && pwd === 'abc') {
      const generateTime = Date.now();
      const uid = uuid.v4();
      if (await redisDb.exits(userName + '.Token')) await redisDb.del(userName + '.Token');
      await redisDb.set(userName + '.Token', userName + uid, 7 * 24 * 60 * 60 * 1000);
      const token = await JWT.generate({ userId: userName, g_t: generateTime, u_id: uid });
      response(ctx, 200, {
        data: token
      });
      return;
    }
    response(ctx, 300, { data: null }, 'faild');
  })
  .post('/register', async ctx => {
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
    const check = `select nickName from user_main where nickName = '${nickName}'`;
    const insert = `insert into user_main (nickName,regTime,passWord) values(?,now(),?)`;
    console.log(check);
    const checkIshasReg = await DB.handle(check, []);
    if (checkIshasReg.code === 500) {
      response(ctx, 500, { data: null }, '注册失败(查询)');
      return;
    }
    if (checkIshasReg.code === 200 && checkIshasReg.result.length) {
      response(ctx, 201, { data: null }, '用户已存在');
      return;
    }
    const insertResult = await DB.handle(insert, [nickName, passWord]);
    if (insertResult.code === 500) {
      response(ctx, 500, { data: null }, '注册失败(插入)');
      return;
    }
    const generateTime = Date.now();
    await redisDb.set(nickName + '.Token', nickName, 7 * 24 * 60 * 60 * 1000);
    const token = await JWT.generate({ userId: nickName, g_t: generateTime });
    response(ctx, 200, { data: { Token: token } }, '注册成功');

    console.log(uuid.v4(), insertResult);

    // console.log(111, redisDb.search('admin*'));
  })
  .use(jwtCheck)
  .post('/delete', async ctx => {
    console.log('========================');
    console.log('获取token----》', ctx.header.authorization);
    console.log('========================');
    try {
      const decoded = await JWT.verify(ctx.header.authorization.split(' ')[1]);
      console.log(decoded);
    } catch (err) {
      // err
      console.log(err);
    }

    // jwt.verify(ctx.header.authorization, 'lalallala')
    //
    ctx.body = 'this is user delete page';
  });

export default router.routes();
