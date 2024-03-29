import * as fs from 'fs';
import * as Koa from 'koa';
import * as captcha from 'svg-captcha';
import { Controller, Request } from '@/decorators';
import sendCode from '@/controllers/mail';
import { getUserDetailByUserid } from '@/controllers/oauth/ding';

import { LOG4, Session, response } from '@/util';

@Controller('/common')
export default class Common {
  @Request('/captcha', 'get', { log: false })
  async createCaptcha(ctx: Koa.Context) {
    const creatCaptcha = captcha.createMathExpr({
      noise: 4,
      color: true,
      background: 'rgba(0,0,0,0)' // 透明色背景
    });

    LOG4.http.info('======获取验证码=====' + creatCaptcha.text);
    Session.set(ctx, 'img', creatCaptcha.text, 1 * 60 * 1000); // 存储验证码到session 有效期1分钟
    ctx.type = 'svg';
    ctx.body = creatCaptcha.data;
  }

  @Request('/mail', 'post')
  async sendMail(ctx: Koa.Context) {
    const { code, data, msg } = (await sendCode(ctx)) as any;
    response(ctx, code, { data }, msg);
  }
  @Request('/at', 'get')
  async getDingat(ctx: Koa.Context) {
    const data = await getUserDetailByUserid(ctx);
    response(ctx, 200, { data });
  }

  @Request('/video', 'post', { log: false })
  async video(ctx: Koa.Context) {
    const path = '/Users/huangfu/Downloads/dagangwangwei.mp4';
    const range: string | null = ctx.req.headers.range || null;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      let end = parts[1] ? parseInt(parts[1], 10) : start + 1024 * 1000;
      // end 在最后取值为 fileSize - 1
      end = end > fileSize - 1 ? fileSize - 1 : end;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(path, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4'
      };
      ctx.res.writeHead(206, head);
      ctx.body = file;
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      };
      ctx.res.writeHead(200, head);
      ctx.body = fs.createReadStream(path);
    }
  }
}
