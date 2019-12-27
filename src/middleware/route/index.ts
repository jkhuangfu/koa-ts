import * as Koa from 'koa';
import * as Route from 'koa-router';
import routeSource from '../../routes';

const Router = new Route<Koa.DefaultContext, Koa.Context>();

interface middleware {
  [key: string]: (
    context: Koa.ParameterizedContext<
      Koa.DefaultContext,
      Koa.Context & Route.IRouterParamContext<Koa.DefaultContext, Koa.Context>
    >,
    next: Koa.Next
  ) => any;
}

const routes: middleware = routeSource;

for (let i in routes) {
  Router.use('', routes[i]);
}

export default Router.routes();
