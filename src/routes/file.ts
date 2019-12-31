import * as Koa from 'koa';
import * as Router from 'koa-router';
import File from '../controllers/file';
import '../controllers/watcher';
const router = new Router<Koa.DefaultContext, Koa.Context>();
router
  .prefix('/file')
  .post('/multi/upload', async ctx => {
    const res = await File.MultiFile(ctx);
    response(ctx, res ? 200 : 500);
  })
  .post('/single/upload', async ctx => {
    const res = await File.SingleFile(ctx);
    response(ctx, res ? 200 : 500);
  })
  .post('/query', async ctx => {
    const res = await File.query(ctx);
    response(ctx, res ? 200 : 500, { data: res });
  });

export default router.routes();
