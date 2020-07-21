import * as Koa from 'koa';
/**
 * @name jwtCheck
 * @description 检查用户是否需要登录的中间件
 * @return 401鉴权状态码
 */
interface USERINFO {
  [key: string]: any;
}
const jwtCheck = async (ctx: Koa.Context, next: Koa.Next) => {
  const { authorization } = ctx.header;
  const user: USERINFO | any = authorization && (await JWT.verify(authorization.split(' ')[1]));
  const userLoginUid = user && (await redisDb.get(`${user.userId}.jwt_token`));
  if (!authorization || !user || !userLoginUid || userLoginUid !== user.u_id) {
    ctx.throw(401, 'access_denied');
  }
  await next();
};
export default jwtCheck;
