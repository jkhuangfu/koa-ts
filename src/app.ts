import * as Koa from 'koa';
import 'module-alias/register';
import * as http from 'http';
import * as path from 'path';
import * as views from 'koa-views';
import * as koaStatic from 'koa-static';
import * as helmet from 'koa-helmet';
import middleware from '@/middleware';
import io from '@/controllers/socket/socket-io';
import { LOG4, getParams, response } from '@/util';
import { timeout } from 'koa2-timeout';
// import '@/bull';

// import qpdf from 'node-qpdf2';

const timeOutHandler = (ctx: Koa.Context) => {
  const { method, path: methodPath } = ctx;
  const params = JSON.stringify(getParams(ctx));
  LOG4.http.warn(`请求方式-->${method},请求连接-->${methodPath},传递参数-->${params},请求超时`);
  response(ctx, 408, { data: 'Request timeout' });
};

const app = new Koa();
const server = http.createServer(app.callback());
app.keys = ['W@7712duagdb6hddhgW!'];
// 全局变量
app.context.JWT_SECRET_KEY = '@h7676_77R#$';
app.proxy = true;
io(server);
app
  .use(timeout(3000, timeOutHandler))
  .use(middleware.trace)
  .use(views(path.join(__dirname, 'views'), { extension: 'ejs' }))
  .use(koaStatic(path.join(__dirname, 'public')))
  .use(
    helmet({
      contentSecurityPolicy: false
    })
  )
  .use(middleware.koaBody)
  .use(middleware.koaSession(app))
  .use(middleware.koaCors)
  .use(middleware.router.routes())
  .use(middleware.router.allowedMethods())
  .on('error', (err: Error) => {
    LOG4.app.error(err);
  });
server.listen(3330, () => {
  LOG4.app.info('server is running at port 3330');
});
