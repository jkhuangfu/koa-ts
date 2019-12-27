import * as Koa from 'koa';
// 处理错误信息,发送错误码,记录请求耗时
const err = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    const START_TIME = Date.now();
    await next();
    const END_TIME = Date.now();
    LOG4.http.info(`请求连接--->${ctx.path} 耗时时间: ${END_TIME - START_TIME} MS`);
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.type = 'json';
    ctx.response.body = {
      code: ctx.response.status,
      message: err.message,
      timestamp: Date.now()
    };
    ctx.app.emit('error', err, ctx);
  }
};
export default err;
