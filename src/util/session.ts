import { Context } from 'koa';

interface Session {
  /** set 设置session */
  set: (ctx: Context, key: string, value: any, age: number) => void;
  /** get 获取session */
  get: (ctx: Context, key: string) => string | null;
  /** delete 删除session */
  delete: (ctx: Context, key: string) => void;
}

/**
 * @description session处理
 * @function set 设置session
 * @function get 获取session
 * @function delete 删除session
 */
export class SessionImpl implements Session {
  set(ctx: Context, key: string, value: any, expires: number = 24 * 60 * 60 * 1000) {
    if (ctx.session) {
      ctx.session[key] = value;
      ctx.session.maxAge = expires;
    }
  }
  get(ctx: Context, key: string) {
    if (ctx.session) return ctx.session[key];
    return null;
  }
  delete(ctx: Context, key: string) {
    if (ctx.session) delete ctx.session[key];
  }
}

export default new SessionImpl();
