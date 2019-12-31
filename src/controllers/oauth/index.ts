import * as Koa from 'koa';
import axios from 'axios';
import { gitDev, gitProd } from '../../config/github';

const { NODE_ENV } = process.env;
const { clientID, clientSecret } = NODE_ENV === 'development' ? gitDev : gitProd;

const auth = async (ctx: Koa.Context) => {
  const requestCode = ctx.request.query.code;
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
    ctx.response.redirect(`/welcome.html?name=${name}`);
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

export default auth;
