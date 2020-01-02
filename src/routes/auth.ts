import * as Koa from 'koa';
import * as Router from 'koa-router';
import github from '../controllers/oauth/github';
import baidu from '../controllers/oauth/baidu';

const router = new Router<Koa.DefaultContext, Koa.Context>();

router
  .prefix('/oauth')
  .get('/github', async (ctx: Koa.Context) => {
    await github(ctx);
  })
  .get('/baidu', async (ctx: Koa.Context) => {
    await baidu(ctx);
  });
export default router.routes();
