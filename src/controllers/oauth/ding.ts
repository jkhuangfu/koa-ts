import * as Koa from 'koa';
import axios from 'axios';
import { dev, prod } from '@/config/auth';

const { NODE_ENV } = process.env;
const {
  baidu: { clientID, clientSecret }
} = NODE_ENV === 'development' ? dev : prod;

const ding = async (ctx: Koa.Context) => {
  const { code } = getParams(ctx); // ctx.request.query.code;
  LOG4.http.info('dingding authorization code:', code);
  const timestamp = Date.now();
  const key = 'weJfHsUQ7AbHkiVTKCWZ_t0neswXZUrkTgy2lqAXRJmk0vzrbcqJwrOOXygw2m8R';
  const signature = encryption.hmac(timestamp.toString(), 'sha256', key);
  try {
    const tokenResponse = await axios({
      method: 'post',
      url: `https://oapi.dingtalk.com/sns/getuserinfo_bycode?accessKey=dingoabgnimhi1utq1spnp&timestamp=${timestamp}&signature=${encodeURIComponent(
        signature
      )}`,
      data: { tmp_auth_code: code }
    });
    ctx.body = tokenResponse.data;
    // {
    //   "errcode": 0,
    //   "errmsg": "ok",
    //   "user_info": {
    //       "nick": "张三",
    //       "openid": "liSii8KCxxxxx",
    //       "unionid": "7Huu46kk"
    //   }
  } catch (e) {
    LOG4.http.error(`钉钉授权失败，错误信息--->${e}`);
    // ctx.response.redirect(`/error.html`);
    ctx.body = {
      code: 500,
      msg: '钉钉授权失败',
      data: e,
      timestamp: Date.now()
    };
  }
};

export default ding;
