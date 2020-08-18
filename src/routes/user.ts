import * as Koa from 'koa';
import UserController from '@/controllers/user';
import { Controller, Request, BaseRouter, RequestMethod } from '@/decorators';

@Controller('/user')
class User extends BaseRouter {
  @Request('/login', RequestMethod.POST)
  async login(ctx: Koa.Context) {
    await UserController.Login(ctx);
  }

  @Request('/register', RequestMethod.POST)
  async register(ctx: Koa.Context) {
    await UserController.Register(ctx);
  }
}

export default User.routes();
