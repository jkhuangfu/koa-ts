import * as Koa from 'koa';
// 处理错误信息,发送错误码,记录请求耗时
const err = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    const START_TIME = Date.now();
    // ctx.session && (await ctx.session.manuallyCommit());
    await next();
    const END_TIME = Date.now();
    LOG4.http.trace(
      `请求连接--->${ctx.path},状态码--->${ctx.status},参数--->${JSON.stringify(
        ctx.request.body || ctx.request.query
      )} ,耗时---> ${END_TIME - START_TIME} MS`
    );
    if (ctx.status === 404) {
      return (ctx.body = { url: `${ctx.path}`, status: 404, msg: '接口不存在', timestamp: Date.now() });
    }
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
