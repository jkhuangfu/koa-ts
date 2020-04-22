import * as captcha from 'svg-captcha';
import * as Router from 'koa-router';
import * as Koa from 'koa';
import sendCode from '../controllers/mail';
import { getTvList, spiderData } from '../controllers/tv';
const router = new Router<Koa.DefaultContext, Koa.Context>();
router
  .prefix('/common')
  .get('/captcha', (ctx: Koa.Context) => {
    const creatCaptcha: captcha.CaptchaObj = captcha.createMathExpr({
      noise: 4,
      color: true,
      background: 'rgba(0,0,0,0)' // 透明色背景
    });
    LOG4.http.info('======获取验证码=====' + creatCaptcha.text);
    Session.set(ctx, 'img', creatCaptcha.text, 1 * 60 * 1000); // 存储验证码到session 有效期1分钟
    ctx.response.type = 'svg';
    ctx.response.body = creatCaptcha.data;
  })
  .post('/mail', async (ctx: Koa.Context) => {
    const { code, data, msg } = (await sendCode(ctx)) as any;
    response(ctx, code, { data }, msg);
  })
  .get('/tv', async (ctx: Koa.Context) => {
    const data = await spiderData();
    const clear = 'truncate table tb_tv';
    let insert: string = 'INSERT INTO  tb_tv (tv_name,tv_url,is_hd) values ';
    data.map((item: any, index: number) => {
      const { name, url, type } = item;
      insert += `('${name}','${url}','${type}')${index < data.length - 1 ? ',' : ''}`;
    });
    await DB.handle(clear, []);
    await DB.handle(insert, []);
    response(ctx, 200, { data }, '1');
  })
  .post('/getTvList', async (ctx: Koa.Context) => {
    await getTvList(ctx);
  });

export default router.routes();
