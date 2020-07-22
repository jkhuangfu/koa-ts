import * as Router from 'koa-router';
import * as Koa from 'koa';
import * as Tv from '@/controllers/tv';
const router = new Router<Koa.DefaultContext, Koa.Context>();
router
  .prefix('/tv')
  .get('/spider', async (ctx: Koa.Context) => {
    await Tv.spiderData(ctx);
  })
  .post('/login', async (ctx: Koa.Context) => {
    await Tv.tvUser.login(ctx);
  })
  .post('/checkLogin', async (ctx: Koa.Context) => {
    await Tv.tvUser.checkLogin(ctx);
  })
  .post('/getList', async (ctx: Koa.Context) => {
    await Tv.getTvList(ctx);
  });

export default router.routes();
