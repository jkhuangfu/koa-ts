import * as Koa from 'koa';
import { Controller, Request } from '@/decorators';
import * as TvController from '@/controllers/tv';

@Controller('/tv')
export default class Tv {
  @Request('/spider', 'get')
  async spiderData(ctx: Koa.Context) {
    await TvController.spiderData(ctx);
  }

  @Request('/login', 'post')
  async login(ctx: Koa.Context) {
    await TvController.tvUser.login(ctx);
  }

  @Request('/checkLogin', 'post')
  async checkLogin(ctx: Koa.Context) {
    await TvController.tvUser.checkLogin(ctx);
  }

  @Request('/getList', 'post')
  async getList(ctx: Koa.Context) {
    await TvController.getTvList(ctx);
  }
}
