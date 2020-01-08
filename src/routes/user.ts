import * as Router from 'koa-router';
import * as Koa from 'koa';
import jwtCheck from '../middleware/checklogin';
import * as uuid from 'uuid';
const router = new Router<Koa.DefaultContext, Koa.Context>();
router
  .prefix('/user')
  .post('/login', async (ctx: Koa.Context) => {
    // Session.set(ctx, 'user', { a: Date.now() });
    // LOG4.http.info(encryption.hash('111', 'md5'));
    // @ts-ignore
    // await ctx.session.manuallyCommit();
    // console.log(ctx.session);
    const { userName, pwd } = ctx.request.body;
    // ctx.cookies.set('DRNET_UID', userName + Date.now().toString());
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
  .post('/t', async ctx => {
    console.log(uuid.v4());
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
