import * as cache from 'memory-cache';
import * as Koa from 'koa';
import ticket from './ticket';
import token from './token';
import wechatConfig from '../../../config/wechat';
const { APP_ID, APP_SECRET } = wechatConfig;

export default async (ctx: Koa.Context) => {
  try {
    const { url } = ctx.request.body;
    const NONCT_STR = 'W6@jsgfh!qeJ';
    const timestamp = Math.floor(Date.now() / 1000); // 时间戳
    const CACHE_TOKEN = cache.get('access_token');
    const CACHE_TICKET = cache.get('jsapi_ticket');
    if (CACHE_TOKEN && CACHE_TICKET) {
      // 缓存中有token和jsapi_ticket
      LOG4.http.info('缓存中有token和jsapi_ticket');
      const str = `jsapi_ticket=${CACHE_TICKET}&noncestr=${NONCT_STR}&timestamp=${timestamp}&url=${decodeURIComponent(
        url
      )}`;
      LOG4.http.info(str);
      const signature = encryption.hash(str, 'sha1');
      const data = {
        appId: APP_ID, // 必填，公众号的唯一标识
        timestamp, // 必填，生成签名的时间戳
        nonceStr: NONCT_STR, // 必填，生成签名的随机串
        signature // 必填，签名，见附录1
      };
      response(ctx, 200, { data });
    } else {
      LOG4.http.info('缓存中没有token和jsapi_ticket');
      const TOKEN = await token(APP_ID, APP_SECRET);
      const jsapiTicket = await ticket(TOKEN);
      const str = `jsapi_ticket=${jsapiTicket}&noncestr=${NONCT_STR}&timestamp=${timestamp}&url=${decodeURIComponent(
        url
      )}`;
      const signature = encryption.hash(str, 'sha1');
      const data = {
        appId: APP_ID, // 必填，公众号的唯一标识
        timestamp, // 必填，生成签名的时间戳
        nonceStr: NONCT_STR, // 必填，生成签名的随机串
        signature // 必填，签名，见附录1
      };
      response(ctx, 200, { data });
    }
  } catch (error) {
    LOG4.http.error(error);
    response(ctx, 500, { data: null }, '签名失败');
  }
};
