import * as Koa from 'koa';
import { Controller, Request, BaseRouter, RequestMethod } from '@/decorators';
import github from '@/controllers/oauth/github';
import baidu from '@/controllers/oauth/baidu';
import ding from '@/controllers/oauth/ding';

@Controller('/oauth')
class Oauth extends BaseRouter {
  @Request('/github', RequestMethod.GET)
  async githubOauth(ctx: Koa.Context) {
    await github(ctx);
  }
  @Request('/baidu', RequestMethod.GET)
  async baiduOatuth(ctx: Koa.Context) {
    await baidu(ctx);
  }

  @Request('/ding', RequestMethod.GET)
  async dingOuath(ctx: Koa.Context) {
    await ding(ctx);
  }
}

export default Oauth.routes();
