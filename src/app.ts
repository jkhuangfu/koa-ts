import * as Koa from 'koa';
import * as path from 'path';
import * as views from 'koa-views';
import * as koaStatic from 'koa-static';
import * as helmet from 'koa-helmet';
import { globInit } from './util';
import middleware from './middleware';
import './mongoose';

(async () => {
  const app = new Koa();
  app.keys = ['W@7712duagdb6hddhgW!'];
  await globInit();
  app
    .use(middleware.trace)
    .use(helmet())
    .use(middleware.koaBody)
    .use(middleware.koaSession(app))
    .use(views(path.join(__dirname, 'views'), { extension: 'html' }))
    .use(middleware.router)
    .use(koaStatic(path.join(__dirname, 'public')))
    .on('error', err => {
      LOG4.error.error(err);
    })
    .listen(3000, () => {
      LOG4.app.info('server is running at port 3000');
    });
})();
