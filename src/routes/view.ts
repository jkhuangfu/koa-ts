import * as Koa from 'koa';
import { Controller, Request } from '@/decorators';

@Controller()
export default class View {
  @Request('/so', 'get')
  async home(ctx: Koa.Context) {
    await ctx.render('socket1', { title: 'scoket demo' });
  }

  @Request('/', 'get')
  async index(ctx: Koa.Context) {
    await ctx.render('index');
  }

  @Request('/ding', 'get')
  async ding(ctx: Koa.Context) {
    await ctx.render('ding');
  }

  @Request('/io', 'get')
  async io(ctx: Koa.Context) {
    await ctx.render('socket', { title: 'scoket demo' });
  }
}
