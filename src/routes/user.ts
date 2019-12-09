import * as Router from 'koa-router';
import * as Koa from 'koa';
const router = new Router({prefix: '/user'});
router
    .get('/add', async (ctx: Koa.ExtendableContext) => {
        await redisDb.set('11', '222', 300000);
        response(ctx, 200, {msg: 'success', data: []});
    })
    .get('/delete', ctx => {
        ctx.body = 'this is user delete page';
    });
export default router.routes();
