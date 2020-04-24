import * as Koa from 'koa';
import * as path from 'path';
import * as views from 'koa-views';
import * as koaStatic from 'koa-static';
import * as helmet from 'koa-helmet';
import { globInit } from './util';
import middleware from './middleware';
// import './mongoose';

(async () => {
  const app = new Koa();
  app.keys = ['W@7712duagdb6hddhgW!'];
  await globInit();
  app
    .use(middleware.trace)
    .use(views(path.join(__dirname, 'views'), { extension: 'ejs' }))
    .use(koaStatic(path.join(__dirname, 'public')))
    .use(helmet())
    .use(middleware.koaBody)
    .use(middleware.koaSession(app))
    .use(middleware.koaCors)
    .use(middleware.router)
    .on('error', (err: any) => {
      LOG4.error.error(err);
    })
    .listen(3330, () => {
      LOG4.app.info('server is running at port 3330');
    });
})();
