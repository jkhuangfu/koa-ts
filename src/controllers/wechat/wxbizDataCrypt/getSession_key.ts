import * as Koa from 'koa';
import { getParams, $http } from '@/util';

export default async (ctx: Koa.Context) => {
  const { appid, secret, code } = getParams(ctx);
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
  return await $http.get(url);
};
