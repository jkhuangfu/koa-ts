import { Context } from 'koa';
/**
 * @description session处理
 * @function set 设置session
 * @function get 获取session
 * @function delete 删除session
 */
export default class Session {
  public static set(ctx: Context, key: string, value: any) {
    if (ctx.session) ctx.session[key] = value;
  }
  public static get(ctx: Context, key: string) {
    if (ctx.session) return ctx.session[key];
    return null;
  }
  public static delete(ctx: Context, key: string) {
    if (ctx.session) delete ctx.session[key];
  }
}
