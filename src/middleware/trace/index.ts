import * as Koa from 'koa';
// 处理错误信息,发送错误码,记录请求耗时
export default async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    const START_TIME = Date.now();
    await next();
    const END_TIME = Date.now();
    const { method, path, status } = ctx;
    const params = JSON.stringify(getParams(ctx));
    const useTime = END_TIME - START_TIME;
    LOG4.http.trace(
      `请求方式-->${method},请求连接-->${path},返回状态码-->${status},传递参数-->${params} ,耗时--> ${useTime} MS`
    );
    if (ctx.status === 404) {
      return (ctx.body = { url: `${path}`, status: 404, msg: '接口不存在', timestamp: Date.now() });
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
