import * as Koa from 'koa';
/**
 * @name jwtCheck
 * @description 检查用户是否需要登录的中间件
 * @return 401鉴权状态码
 */

const jwtCheck = async (ctx: Koa.Context, next: Koa.Next) => {
  const { authorization } = ctx.header;
  if ((ctx.method === 'POST' && !authorization) || !(await JWT.verify(authorization.split(' ')[1]))) {
    ctx.throw(401, 'access_denied');
  }
  await next();
};
export default jwtCheck;
