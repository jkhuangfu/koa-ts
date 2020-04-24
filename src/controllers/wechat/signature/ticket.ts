import * as cache from 'memory-cache';

export default async (token: string) => {
  LOG4.http.info('===获取ticket====token=>' + token);
  const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`;
  const response = await $http.get(url);
  const { data, status } = response;
  if (status !== 200) {
    LOG4.http.error('ticket获取失败=====' + data.errmsg);
    return false;
  }
  LOG4.http.info('ticket===' + data.ticket);
  await cache.put('jsapi_ticket', data.ticket, 7200000); // 放入缓存7200000ms有效期
  return data.ticket;
};
