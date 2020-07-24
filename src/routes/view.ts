import * as Router from 'koa-router';
import * as Koa from 'koa';
const router = new Router<Koa.DefaultContext, Koa.Context>();

router
  .prefix('')
  .get('/', async (ctx: Koa.Context) => {
    // ctx.session.user =
    // ctx.session && (ctx.session.user = { name: 1 });
    await ctx.render('socket1', { title: 'scoket demo' });
  })
  .get('/io', async (ctx: Koa.Context) => {
    await ctx.render('socket', { title: 'scoket demo' });
  })
  // .get('/authpage/:id', async (ctx: Koa.Context) => {
  //   await ctx.render('auth', { id: ctx.params.id });
  // })
  .get('/delete', (ctx: Koa.Context) => {
    ctx.body = 'this is user delete page' + JSON.stringify(ctx.session && ctx.session.user);
  })
  .get('/he', (ctx: Koa.Context) => {
    ctx.body = 'this is redirect page';
  });
export default router.routes();
