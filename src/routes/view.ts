import * as Koa from 'koa';
import { Controller, Request } from '@/decorators';

@Controller()
export default class View {
  @Request('/', 'get')
  async home(ctx: Koa.Context) {
    await ctx.render('socket1', { title: 'scoket demo' });
  }

  @Request('/io', 'get')
  async io(ctx: Koa.Context) {
    await ctx.render('socket', { title: 'scoket demo' });
  }
}
