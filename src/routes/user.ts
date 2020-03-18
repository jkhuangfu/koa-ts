import * as Router from 'koa-router';
import * as Koa from 'koa';
import jwtCheck from '../middleware/checklogin';
import userController from '../controllers/user';
const router = new Router<Koa.DefaultContext, Koa.Context>();
router
  .prefix('/user')
  .post('/login', async (ctx: Koa.Context) => {
    await userController.Login(ctx);
  })
  .post('/register', async (ctx: Koa.Context) => {
    await userController.Register(ctx);
  })
  .use(jwtCheck);

export default router.routes();
