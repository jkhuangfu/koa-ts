import * as Koa from 'koa';
import 'module-alias/register';
import * as http from 'http';
import * as path from 'path';
import * as views from 'koa-views';
import * as koaStatic from 'koa-static';
import * as helmet from 'koa-helmet';
import { globInit } from '@/util';
import middleware from '@/middleware';
import io from '@/controllers/socket/socket-io';
// import './mongoose';

(async () => {
  const app = new Koa();
  const server = http.createServer(app.callback());
  app.keys = ['W@7712duagdb6hddhgW!'];
  await globInit();
  io(server);
  app
    .use(middleware.trace)
    .use(views(path.join(__dirname, 'views'), { extension: 'ejs' }))
    .use(koaStatic(path.join(__dirname, 'public')))
    .use(helmet())
    .use(middleware.koaBody)
    .use(middleware.koaSession(app))
    .use(middleware.koaCors)
    .use(middleware.router)
    .on('error', (err: Error) => {
      LOG4.error.error(err);
    });
  server.listen(3330, () => {
    LOG4.app.info('server is running at port 3330');
  });
})();
