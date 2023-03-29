import { LOG4, $http, redis } from '@/util';

export const getToken = async (appid: string, secret: string) => {
  LOG4.http.info('===微信获取token====');
  let token = await redis.get('access_token');
  if (!token) {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
    const response: any = await $http.get(url);
    const { access_token, expires_in } = response;
    if (!access_token) {
      LOG4.http.error('===获取token失败===' + JSON.stringify(response));
      return false;
    }
    token = access_token;
    LOG4.http.info('===获取access_token并放入cache===' + access_token);
    await redis.set('access_token', access_token, expires_in); // 放入缓存7200s有效期两小时有效期
  }

  return token;
};
