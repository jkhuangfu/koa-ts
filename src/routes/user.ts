import * as Router from 'koa-router';
import * as Koa from 'koa';
import UserController from '@/controllers/user';
const router = new Router<Koa.DefaultContext, Koa.Context>();
router
  .prefix('/user')
  .post('/login', async (ctx: Koa.Context) => {
    await UserController.Login(ctx);
  })
  .post('/register', async (ctx: Koa.Context) => {
    await UserController.Register(ctx);
  });

export default router.routes();
