import * as Koa from 'koa';
import { verify } from 'jsonwebtoken';
import { redis } from '@/util';

/**
 * @name jwtCheck
 * @description 检查用户是否需要登录的中间件
 * @return 401鉴权状态码
 */

const jwtCheck = async (ctx: Koa.Context, next: Koa.Next) => {
  const { authorization } = ctx.header;
  const user: any = authorization && verify(authorization, ctx.JWT_SECRET_KEY);
  const redisInfo = user && (await redis.get(`${user.userId}.jwt_token`));
  if (!authorization || !user || !redisInfo || redisInfo !== authorization) {
    ctx.status = 401;
    return;
  }
  await next();
};
export default jwtCheck;
