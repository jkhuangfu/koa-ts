import * as Koa from 'koa';
export default (ctx: Koa.Context) => {
  return ctx.query || ctx.request.body || ctx.request.query;
};
