import * as Koa from 'koa';
import axios from 'axios';
import { dev, prod } from '@/config/auth';

const { NODE_ENV } = process.env;
const {
  baidu: { clientID, clientSecret }
} = NODE_ENV === 'development' ? dev : prod;

const baidu = async (ctx: Koa.Context) => {
  const { code: requestCode } = getParams(ctx); // ctx.request.query.code;
  LOG4.http.info('baidu authorization code:', requestCode);
  try {
    const tokenResponse = await axios({
      method: 'post',
      url: `https://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code&code=${requestCode}&client_id=${clientID}&client_secret=${clientSecret}&redirect_uri=http://127.0.0.1:3000/oauth/baidu`
    });
    const accessToken = tokenResponse.data.access_token;
    LOG4.http.info(`baidu access token: ${accessToken}`);

    const result = await axios({
      method: 'get',
      url: `https://openapi.baidu.com/rest/2.0/passport/users/getInfo?access_token=${accessToken}`
    });
    // ctx.response.redirect('http://baidu.com?code=' + result.data.openid);
    await ctx.render(`auth`, { data: JSON.stringify(result.data) });
    // return result.data;
    // 获取用户头像 http://tb.himg.baidu.com/sys/portraitn/item/+portrait字段 https协议有安全问题。。。
  } catch (e) {
    LOG4.http.error(`baidu 授权失败，错误信息--->${e}`);
    // ctx.response.redirect(`/error.html`);

    ctx.body = {
      code: 500,
      msg: 'baidu授权失败',
      data: e,
      timestamp: Date.now()
    };
  }
};

export default baidu;
