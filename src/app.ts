import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import * as path from 'path';
import * as session from 'koa-session';
import * as views from 'koa-views';
import * as koaStatic from 'koa-static';
import { globInit } from './util';
import routes from './middleware/route';
import './mongoose';
const bodyParse = koaBody({
  multipart: true, // 支持文件上传
  formidable: {
    uploadDir: path.join(__dirname, '/upload/'), // 设置文件上传（缓存）目录
    keepExtensions: true, // 保持文件的后缀
    maxFileSize: 2 * 1024 * 1024,
    onFileBegin: (name, file) => {
      // 上传的文件进行重命名 这里改为上传时的原始名字
      file.path = path.join(__dirname, '/upload/') + file.name;
    }
  }
});

const sessionConfig = {
  key: 'dr_net',
  maxAge: 30 * 60 * 1000, // session 有效期 30Min
  autoCommit: true,
  overwrite: true,
  rolling: true, // 设置为 true 刷新页面重新计时
  signed: true
};

// 处理错误信息,发送错误码
const errMid = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    await next();
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
(async () => {
  const app = new Koa();
  app.keys = ['W@7712duagdb6hddhgW!'];
  await globInit();
  app
    .use(errMid)
    .use(bodyParse)
    .use(session(sessionConfig, app))
    .use(
      views(path.join(__dirname, 'views'), {
        extension: 'html'
      })
    )
    .use(routes)
    .use(koaStatic(path.join(__dirname, 'public')))
    .on('error', err => {
      LOG4.error(err);
    })
    .listen(3000, () => {
      console.log('server is running at port 3000');
    });
})();
