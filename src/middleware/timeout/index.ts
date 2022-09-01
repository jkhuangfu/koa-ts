import { Context, Next } from 'koa';
import { getParams, LOG4, response } from '@/util';

export default async (ctx: Context, next: Next) => {
  let timer: NodeJS.Timeout;
  const timeout = 4000; // 设置超时时间
  const { method, path } = ctx;
  const params = JSON.stringify(getParams(ctx));
  await Promise.race([
    new Promise<void>(resolve => {
      timer = setTimeout(() => {
        LOG4.http.warn(`请求方式-->${method},请求连接-->${path},传递参数-->${params},请求超时`);
        response(ctx, 408, { data: 'Request timeout' });
        resolve();
      }, timeout);
    }),
    new Promise<void>(resolve => {
      (async () => {
        await next();
        clearTimeout(timer);
        resolve();
      })();
    })
  ]);
};
