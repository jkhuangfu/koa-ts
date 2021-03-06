import * as Koa from 'koa';
import { Controller, Request } from '@/decorators';
import github from '@/controllers/oauth/github';
import baidu from '@/controllers/oauth/baidu';
import { sendMessageByRobot } from '@/controllers/oauth/ding';

@Controller('/oauth')
export default class Oauth {
  @Request('/github', 'get')
  async githubOauth(ctx: Koa.Context) {
    await github(ctx);
  }
  @Request('/baidu', 'get')
  async baiduOatuth(ctx: Koa.Context) {
    await baidu(ctx);
  }

  @Request('/ding/robot', 'get')
  async dingOuath(ctx: Koa.Context) {
    await sendMessageByRobot(ctx);
  }
}
