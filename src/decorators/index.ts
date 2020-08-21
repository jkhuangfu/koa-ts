import * as KoaRouter from 'koa-router';
import * as Koa from 'koa';

type Middleware = (ctx: Koa.Context, next: Koa.Next) => void;

export function Request(url: string, method: string, ...middleware: Middleware[]) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;
    descriptor.value = (router: any) => {
      router[method](url, ...middleware, async (ctx: Koa.Context, next: Koa.Next) => {
        await fn(ctx, next);
      });
    };
  };
}

export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  ALL = 'all',
  USE = 'use'
}

export function Controller(prefix: string = ''): any {
  const router = new KoaRouter({ prefix });
  return (target: () => any) => {
    const reqList = Object.getOwnPropertyDescriptors(target.prototype);
    for (const v in reqList) {
      // 排除类的构造方法
      if (v !== 'constructor') {
        const fn = reqList[v].value;
        fn(router);
      }
    }
    return router;
  };
}

export class BaseRouter {
  public static routes() {}
}
