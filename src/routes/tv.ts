import * as Koa from 'koa';
import { Controller, Request, BaseRouter, RequestMethod } from '@/decorators';
import * as TvController from '@/controllers/tv';

@Controller('/tv')
class Tv extends BaseRouter {
  @Request('/spider', RequestMethod.GET)
  async spiderData(ctx: Koa.Context) {
    await TvController.spiderData(ctx);
  }

  @Request('/login', RequestMethod.GET)
  async login(ctx: Koa.Context) {
    await TvController.tvUser.login(ctx);
  }

  @Request('/checkLogin', RequestMethod.GET)
  async checkLogin(ctx: Koa.Context) {
    await TvController.tvUser.checkLogin(ctx);
  }

  @Request('/getList', RequestMethod.GET)
  async getList(ctx: Koa.Context) {
    await TvController.getTvList(ctx);
  }
}

export default Tv.routes();
