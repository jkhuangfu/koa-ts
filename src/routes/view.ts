import * as Koa from 'koa';
import { Controller, Request, BaseRouter, RequestMethod } from '@/decorators';

@Controller()
class View extends BaseRouter {
  @Request('/', RequestMethod.GET)
  async home(ctx: Koa.Context) {
    await ctx.render('socket1', { title: 'scoket demo' });
  }

  @Request('/io', RequestMethod.GET)
  async io(ctx: Koa.Context) {
    await ctx.render('socket', { title: 'scoket demo' });
  }
}

export default View.routes();
