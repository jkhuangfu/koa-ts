import * as Koa from 'koa';
import * as cors from '@koa/cors';

const corsDomain = /^http:\/\/localhost|^http:\/\/127.0.0.1|drnet.xyz$/;
const corsOptions = {
  origin: (ctx: Koa.Context) => {
    // 跨域处理
    const requestOrigin = ctx.headers.origin;
    if (corsDomain.test(requestOrigin)) {
      return requestOrigin;
    }
    return false;
  },
  credentials: true
};

export default cors(corsOptions);
