import * as Koa from 'koa';
export default (ctx: Koa.Context) => {
  const { method } = ctx;
  const typeQuery = ctx.query && Object.keys(ctx.query).length;
  const typePost = ctx.request.body && Object.keys(ctx.request.body).length;
  const typeReQuery = ctx.request.query && Object.keys(ctx.request.query).length;
  return (
    (method === 'GET' && ((typeQuery && ctx.query) || (typeReQuery && ctx.request.query))) ||
    (method === 'POST' && typePost && ctx.request.body) ||
    {}
  );
};
