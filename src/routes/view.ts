import * as Router from 'koa-router';
import * as Koa from 'koa';
const router = new Router<Koa.DefaultContext, Koa.Context>();

router
  .prefix('')
  .get('/i', async (ctx: Koa.Context) => {
    // ctx.session.user =
    // ctx.session && (ctx.session.user = { name: 1 });
    await ctx.render('index');
  })
  .get('/add', async (ctx: Koa.Context) => {
    await ctx.render('index');
  })
  .get('/delete', (ctx: Koa.Context) => {
    ctx.body = 'this is user delete page' + JSON.stringify(ctx.session && ctx.session.user);
  })
  .get('/he', (ctx: Koa.Context) => {
    ctx.body = 'this is redirect page';
  });
export default router.routes();
