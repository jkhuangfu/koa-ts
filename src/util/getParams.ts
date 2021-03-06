import * as Koa from 'koa';
/**
 * @description 获取前端传递参数
 * @param {Koa.Context} ctx
 * @return {Object} -前端传递的参数默认为{}
 */
export default (ctx: Koa.Context): { [key: string]: any } => {
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
