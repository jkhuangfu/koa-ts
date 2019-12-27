import * as Router from 'koa-router';
import * as Koa from 'koa';
const router = new Router<Koa.DefaultContext, Koa.Context>();
router
  .prefix('/user')
  .get('/add', async (ctx: Koa.ExtendableContext) => {
    LOG4.info(encryption.hash('111', 'md5'));
    await redisDb.set('11', '222', 300000);
    response(ctx, 200, { data: [] });
  })
  .get('/delete', ctx => {
    ctx.body = 'this is user delete page';
  });
export default router.routes();
