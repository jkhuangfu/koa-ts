import * as Koa from 'koa';
import * as Router from 'koa-router';
import File from '../controllers/file';
import '../controllers/watcher';
const router = new Router<Koa.DefaultContext, Koa.Context>();
router
  .prefix('/file')
  .post('/upload', async ctx => {
    const res = await File.upload(ctx);
    response(ctx, res.length ? 200 : 500);
  })
  .post('/query', async ctx => {
    const res = await File.query(ctx);
    response(ctx, res ? 200 : 500, { data: res });
  })
  .get('/', async ctx => {
    await ctx.render('index');
  });

export default router.routes();
