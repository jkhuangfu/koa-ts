import * as Koa from 'koa';
import axios from 'axios';
import { dev, prod } from '../../config/auth';

const { NODE_ENV } = process.env;
const {
  github: { clientID, clientSecret }
} = NODE_ENV === 'development' ? dev : prod;

const github = async (ctx: Koa.Context) => {
  const { code: requestCode } = getParmas(ctx); // ctx.request.query.code;
  LOG4.http.info('github authorization code:', requestCode);

  try {
    const tokenResponse = await axios({
      method: 'post',
      url:
        'https://github.com/login/oauth/access_token?' +
        `client_id=${clientID}&` +
        `client_secret=${clientSecret}&` +
        `code=${requestCode}`,
      headers: {
        accept: 'application/json'
      }
    });
    const accessToken = tokenResponse.data.access_token;
    LOG4.http.info(`github access token: ${accessToken}`);

    const result = await axios({
      method: 'get',
      url: `https://api.github.com/user`,
      headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`
      }
    });
    const name = result.data.bio;
    response(ctx, 200, result.data);
    // ctx.response.redirect(`/welcome.html?name=${name}`);
  } catch (e) {
    LOG4.http.error(`github 授权失败，错误信息--->${e}`);
    // ctx.response.redirect(`/error.html`);

    ctx.body = {
      code: 500,
      msg: 'github授权失败',
      data: e,
      timestamp: Date.now()
    };
  }
};

export default github;
