import * as Router from 'koa-router';
import * as Koa from 'koa';
const router = new Router({prefix: ''});
router
    .get('/add', async (ctx: Koa.DefaultContext) => {
        await ctx.render('index');
    })
    .get('/delete', ctx => {
        ctx.body = 'this is user delete page';
    });
export default router.routes();
