import * as Router from 'koa-router';
import * as Koa from 'koa';
import userController from '@/controllers/user';
const router = new Router<Koa.DefaultContext, Koa.Context>();
router
  .prefix('/user')
  .post('/login', async (ctx: Koa.Context) => {
    console.log(ctx.request.body);
    await userController.Login(ctx);
  })
  .post('/login_tv', async (ctx: Koa.Context) => {
    const { user, pwd } = ctx.request.body;
    console.log();
    // await userController.Login(ctx);
  })
  .post('/register', async (ctx: Koa.Context) => {
    await userController.Register(ctx);
  });

export default router.routes();
