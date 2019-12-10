import * as Koa from 'koa';
import router from './router';

router
    .prefix('/user')
    .get('/add', async (ctx: Koa.ExtendableContext) => {
        LOG4.info(encryption.hash('111', 'md5'));
        await redisDb.set('11', '222', 300000);
        response(ctx, 200, {msg: 'success', data: []});
    })
    .get('/delete', ctx => {
        ctx.body = 'this is user delete page';
    });
