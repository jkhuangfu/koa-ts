import * as Koa from 'koa';
export default async (ctx: Koa.Context) => {
  const { appid, secret, code } = getParmas(ctx);
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
  const data = await $http.get(url);
  response(ctx, 200, { data });
};
