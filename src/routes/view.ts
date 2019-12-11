import {BaseContext} from 'koa';
import router from './router';

router
    .prefix('')
    .get('/add', async (ctx: BaseContext) => {
        // // @ts-ignore
        // @log(11)
        // class MyClass { }
        //
        // function log(val:any) { // 这个 target 在这里就是 MyClass 这个类
        //     return function (target:any, key:any, descriptor:any) {
        //         /**
        //          * 此处 target 为 C.prototype;
        //          * key 为 method;
        //          * 原 descriptor 为：{ value: f, enumarable: false, writable: true, configurable: true }
        //          */
        //         console.log(val,target,key,descriptor)
        //         // descriptor.writable = val
        //         return descriptor
        //     }
        // }
        //
        // const test = new MyClass()
        // // @ts-ignore
        // console.log(test )// MyClass 被调用

        ctx.session.user = {
            code: Date.now(),
            body: 'hello word',
            obj: {
                a: 2
            }
        };
        console.log(encryption.hash('111', 'md5'));
        await ctx.render('index');
    })
    .get('/delete', (ctx: BaseContext) => {
        ctx.body = 'this is user delete page' + JSON.stringify(ctx.session.user);
    })
    .get('/he', ctx => {
        ctx.body = 'this is redirect page';
    });
