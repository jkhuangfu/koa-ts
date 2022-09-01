import { $http, LOG4, redis } from '@/util';

export const getTicket = async (token: string) => {
  LOG4.http.info('===获取ticket====token=>' + token);
  const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`;
  const response = await $http.get(url);
  const { data, status } = response;
  if (status !== 200) {
    LOG4.http.error('ticket获取失败=====' + data.errmsg);
    return false;
  }
  LOG4.http.info('ticket===' + data.ticket);
  await redis.set('jsapi_ticket', data.ticket, 7200); // 放入缓存7200s有效期
  return data.ticket;
};
