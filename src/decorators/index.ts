import * as KoaRouter from 'koa-router';
import * as Koa from 'koa';

type Middleware = (ctx: Koa.Context, next: Koa.Next) => void;

enum RequestMethod {
  'get',
  'post',
  'put',
  'delete',
  'all',
  'use'
}

type Methods = keyof typeof RequestMethod;

/**
 * @export
 * @param {string} url 请求路径
 * @param {Methods} method 请求方法 e.g: post
 * @param {...Middleware[]} middleware 中间件
 * @returns
 */
export function Request(url: string, method: Methods, log4: boolean = true, ...middleware: Middleware[]) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;
    descriptor.value = (router: any) => {
      router[method](url, ...middleware, async (ctx: Koa.Context, next: Koa.Next) => {
        await fn(ctx, next);
        // 记录返回值
        if (log4) {
          LOG4.http.trace('返回值:', ctx.body);
        }
      });
    };
  };
}

/**
 * @export
 * @param {string} [prefix=''] 请求路径前缀 默认空
 * @returns {*}
 */
export function Controller(prefix: string = ''): any {
  const router = new KoaRouter({ prefix });
  return (target: ClassDecorator) => {
    const reqList = Object.getOwnPropertyDescriptors(target.prototype);
    for (const v in reqList) {
      // 排除类的构造方法
      if (v !== 'constructor') {
        const fn = reqList[v].value;
        fn(router);
      }
    }
    return router.routes();
  };
}
