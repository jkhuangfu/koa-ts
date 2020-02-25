import * as captcha from 'svg-captcha';

import * as Router from 'koa-router';
import * as Koa from 'koa';
const router = new Router<Koa.DefaultContext, Koa.Context>();
router.prefix('/common').get('/captcha', (ctx: Koa.Context) => {
  const creatCaptcha: captcha.CaptchaObj = captcha.createMathExpr({
    noise: 4,
    color: true,
    background: 'rgba(0,0,0,0)' // 透明色背景
  });
  LOG4.http.info('======获取验证码=====' + creatCaptcha.text);
  Session.set(ctx, 'img', creatCaptcha.text, 1 * 60 * 1000); // 存储验证码到session 有效期1分钟
  ctx.response.type = 'svg';
  ctx.response.body = creatCaptcha.data;
});

export default router.routes();
