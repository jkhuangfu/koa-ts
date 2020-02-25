import * as Router from 'koa-router';
import * as Koa from 'koa';
import reply from '../controllers/wechat/replay';
const router = new Router<Koa.DefaultContext, Koa.Context>();

// 微信服务接口加密校验
const getSignature = (timestamp: Date, nonce: string, token: string) => {
  const arr = [token, timestamp, nonce].sort();
  return encryption.hash(arr.join(''), 'sha1');
};

router
  .prefix('/wechat')
  // 微信分享获取签名
  // .post('/wx_signature', (req, res) => {
  //   console.log('======发送微信签名=====');
  //   signature(req, res);
  // })
  // //获取微信 openid
  // .post('/wx_openid', (req, res, next) => {
  //   console.log('======发送微信openid=====');
  //   getOpenid(req, res, next);
  // })
  .get('/t', async ctx => {
    console.log(encryption.hash(encryption.hash('12345', 'md5') + '_drnet', 'md5'));
    console.log(encryption.hash('12345', 'md5'));
    ctx.body = '11';
  })
  .all('/wx_server', async (ctx: Koa.Context) => {
    const { method } = ctx;
    const token = 'wx_token';
    const { signature, echostr, timestamp, nonce } = ctx.request.body || ctx.request.query;
    const crypto = getSignature(timestamp, nonce, token);
    if (method === 'GET') {
      // 此处进行微信token验证
      if (signature === crypto) {
        ctx.body = echostr;
        console.log('微信验证token成功');
      } else {
        ctx.body = 'fail';
        console.log('微信验证token失败');
      }
    } else {
      const replyMessageXml = await reply(ctx);
      ctx.body = replyMessageXml;
    }
  });

export default router.routes();
