import * as Koa from 'koa';
import * as Router from 'koa-router';
import auth from '../controllers/oauth';

const router = new Router<Koa.DefaultContext, Koa.Context>();

router.prefix('/oauth').get('/redirect', async (ctx: Koa.Context) => {
  await auth(ctx);
});
export default router.routes();
