import * as Router from 'koa-router';
import * as Koa from 'koa';
import { reply, Signature, openid } from '@/controllers/wechat';
// import sign from '@/controllers/wechat/signature';
// import openid from '@/controllers/wechat/openid';
const router = new Router<Koa.DefaultContext, Koa.Context>();

// 微信服务接口加密校验
const getSignature = (timestamp: Date, nonce: string, token: string) => {
  const arr = [token, timestamp, nonce].sort();
  return encryption.hash(arr.join(''), 'sha1');
};

router
  .prefix('/wechat')
  // 微信分享获取签名
  .post('/signature', async (ctx: Koa.Context) => {
    await Signature(ctx);
  })
  // 获取微信 openid
  .post('/openid', async (ctx: Koa.Context) => {
    await openid(ctx);
  })
  .all('/wx_server', async (ctx: Koa.Context) => {
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
  });

export default router.routes();
