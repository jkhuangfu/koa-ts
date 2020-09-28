import * as Koa from 'koa';
import { Controller, Request } from '@/decorators';

@Controller()
export default class View {
  @Request('/so', 'get', false)
  async home(ctx: Koa.Context) {
    await ctx.render('socket1', { title: 'scoket demo' });
  }

  @Request('/', 'get', false)
  async index(ctx: Koa.Context) {
    await ctx.render('index');
  }

  @Request('/ding', 'get', false)
  async ding(ctx: Koa.Context) {
    await ctx.render('ding');
  }

  @Request('/io', 'get', false)
  async io(ctx: Koa.Context) {
    await ctx.render('socket', { title: 'scoket demo' });
  }
}
