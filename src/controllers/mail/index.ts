import * as nodemailer from 'nodemailer';
import * as Koa from 'koa';
import mailConfig from '../../config/mail';

const mailTransport = nodemailer.createTransport(mailConfig);
const randomCode = (): string => {
  return (
    Math.floor(Math.random() * 10) +
    '' +
    Math.floor(Math.random() * 10) +
    '' +
    Math.floor(Math.random() * 10) +
    '' +
    Math.floor(Math.random() * 10)
  );
};

const sendCode = async (ctx: Koa.Context) => {
  const { email } = ctx.request.body;
  if (!email) return response(ctx, 201, { data: null }, '接收邮箱为空');
  const code = randomCode();
  return new Promise(resolve => {
    mailTransport.sendMail(
      {
        from: `Dr丶net<${mailConfig.auth.user}>`,
        to: email, // rescive_mail,
        subject: '邮件验证码(系统发送,勿回复)',
        // text:  '您的验证码是'+randomCode(),
        html: `
                <span style="color:#666;">您的验证码是:</span>
                <span style="color:red;font-size:38px;font-weight:500;margin:0 15px;">${code}</span>
                <span style="color:#666;">5分钟内有效</span>
            `
      },
      async err => {
        if (err) {
          LOG4.http.error('Unable to send email: ' + err);
          resolve({ code: 400, data: null, msg: '发送失败' });
        } else {
          const getCount = await redisDb.get(`${email}_count`);
          const sendCounts: any = getCount ? getCount : 0;
          if (sendCounts >= 5) {
            return resolve({ code: 401, data: null, msg: '超过发送次数，明日再试' });
          }
          const count = sendCounts - 0 + 1;
          const oneDay = 24 * 60 * 60;
          const now = new Date();
          const nowSecond = now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds();
          await redisDb.set(email, code, 5 * 60);
          await redisDb.set(`${email}_count`, count, oneDay - nowSecond);
          return resolve({ code: 200, data: null, msg: '发送成功' });
        }
      }
    );
  });
};

export default sendCode;
