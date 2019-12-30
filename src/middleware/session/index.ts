import * as Koa from 'koa';
import * as session from 'koa-session';

const sessionConfig = {
  key: 'dr_net',
  maxAge: 30 * 60 * 1000, // session 有效期 30Min
  autoCommit: true,
  overwrite: true,
  rolling: true, // 设置为 true 刷新页面重新计时
  signed: true
};

const koaSession = (app: Koa) => {
  return session(sessionConfig, app);
};

export default koaSession;
