import * as cache from 'memory-cache';
export default async (appid: string, secret: string) => {
  LOG4.http.info('===微信获取token====');
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
  const response = await $http.get(url);
  const { data, status } = response;
  if (status !== 200) {
    LOG4.http.error('===获取token失败===' + response);
    return false;
  }
  const { access_token } = data;
  LOG4.http.info('===获取access_token并放入cache===' + access_token);

  await cache.put('access_token', access_token, 7200000); // 放入缓存7200000ms有效期两小时有效期
  return access_token;
};
