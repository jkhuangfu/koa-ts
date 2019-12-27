import * as Koa from 'koa';
import * as path from 'path';
import * as session from 'koa-session';
import * as views from 'koa-views';
import * as koaStatic from 'koa-static';
import { globInit } from './util';
import middleware from './middleware';
import './mongoose';

const sessionConfig = {
  key: 'dr_net',
  maxAge: 30 * 60 * 1000, // session 有效期 30Min
  autoCommit: true,
  overwrite: true,
  rolling: true, // 设置为 true 刷新页面重新计时
  signed: true
};

(async () => {
  const app = new Koa();
  app.keys = ['W@7712duagdb6hddhgW!'];
  await globInit();
  app
    .use(middleware.err)
    .use(middleware.koaBody)
    .use(session(sessionConfig, app))
    .use(
      views(path.join(__dirname, 'views'), {
        extension: 'html'
      })
    )
    .use(middleware.router)
    .use(koaStatic(path.join(__dirname, 'public')))
    .on('error', err => {
      LOG4.error.error(err);
    })
    .listen(3000, () => {
      LOG4.app.info('server is running at port 3000');
    });
})();
