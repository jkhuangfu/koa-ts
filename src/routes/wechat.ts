import * as Koa from 'koa';
import { reply, Signature, openid } from '@/controllers/wechat';
import { Controller, Request, BaseRouter, RequestMethod } from '@/decorators';

// 微信服务接口加密校验
const getSignature = (timestamp: Date, nonce: string, token: string) => {
  const arr = [token, timestamp, nonce].sort();
  return encryption.hash(arr.join(''), 'sha1');
};

@Controller('/wechat')
class Wechat extends BaseRouter {
  @Request('/signature', RequestMethod.POST)
  async signature(ctx: Koa.Context) {
    await Signature(ctx);
  }

  @Request('/openid', RequestMethod.POST)
  async openid(ctx: Koa.Context) {
    await openid(ctx);
  }

  @Request('/wx_server', RequestMethod.ALL)
  async wxServer(ctx: Koa.Context) {
    const { method } = ctx;
    const token = 'wx_token';
    const { signature, echostr, timestamp, nonce } = ctx.query;
    const crypto = getSignature(timestamp, nonce, token);
    if (method === 'GET') {
      // 此处进行微信token验证
      if (signature === crypto) {
        ctx.body = echostr;
        LOG4.http.info('微信验证token成功');
      } else {
        ctx.body = 'fail';
        LOG4.http.info('微信验证token失败');
      }
    } else {
      const replyMessageXml = await reply(ctx);
      ctx.body = replyMessageXml;
    }
  }
}

export default Wechat.routes();
