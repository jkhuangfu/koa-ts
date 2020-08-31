import * as fs from 'fs';
import * as Koa from 'koa';
import * as captcha from 'svg-captcha';
import { Controller, Request } from '@/decorators';
import sendCode from '@/controllers/mail';
@Controller('/common')
export default class Common {
  @Request('/captcha', 'get')
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

  @Request('/video', 'post')
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

  @Request('/tt', 'get')
  async tool(ctx: Koa.Context) {
    const data = await fs.readFileSync('/Users/huangfu/Desktop/t.txt');
    const arr = data.toString().split('\n');
    const res: any = [];
    let insert: string = 'INSERT INTO  tb_tv (tv_name,tv_url,is_hd,role) values ';

    arr.map((item: any, index: number) => {
      res.push({
        name: item.split(',')[0],
        url: item.split(',')[1],
        type: 3
      });
      insert += `('${item.split(',')[0]}','${item.split(',')[1]}','2','1')${index < arr.length - 1 ? ',' : ''}`;
    });
    const d = await DB.handle(insert, []);
    response(ctx, 200, { data: null }, '1');
  }
}
