import * as Koa from 'koa';
// 处理错误信息,发送错误码,记录请求耗时
export default async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    const START_TIME = Date.now();
    await next();
    const END_TIME = Date.now();
    const { method, path, status } = ctx;
    const useTime = END_TIME - START_TIME;
    LOG4.http.trace(
      `请求方式-->${method},UA信息--->${ctx.request.header['user-agent']},返回状态码--->${status},请求连接-->${path},耗时-->${useTime}MS `
    );
    if (status >= 400) {
      return (ctx.body = { url: `${path}`, status, msg: ctx.message, timestamp: Date.now() });
    }
  } catch (err: any) {
    ctx.status = err?.statusCode || err?.status || 500;
    ctx.type = 'json';
    ctx.body = {
      code: ctx.response.status,
      message: err.message,
      timestamp: Date.now()
    };
    ctx.app.emit('error', err, ctx);
  }
};
