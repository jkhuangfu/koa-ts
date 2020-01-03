import * as Router from 'koa-router';
import * as Koa from 'koa';
import jwtCheck from '../middleware/checklogin';
const router = new Router<Koa.DefaultContext, Koa.Context>();
router
  .prefix('/user')
  .post('/add', async (ctx: Koa.Context) => {
    Session.set(ctx, 'user', { a: Date.now() });
    LOG4.http.info(encryption.hash('111', 'md5'));
    await redisDb.set('11', '222', 300000);
    const token = await JWT.generate({ data: Date.now() });
    response(ctx, 200, {
      data: token
    });
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
