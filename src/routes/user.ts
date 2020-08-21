import * as Koa from 'koa';
import UserController from '@/controllers/user';
import { Controller, Request } from '@/decorators';

@Controller('/user')
export default class User {
  @Request('/login', 'post')
  async login(ctx: Koa.Context) {
    await UserController.Login(ctx);
  }

  @Request('/register', 'post')
  async register(ctx: Koa.Context) {
    await UserController.Register(ctx);
  }
}
