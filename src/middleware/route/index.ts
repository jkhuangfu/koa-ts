import * as Koa from 'koa';
import * as Route from 'koa-router';
import routeSource from '@/routes';

const router = new Route<Koa.DefaultContext, Koa.Context>();

interface RouterMiddleware {
  [key: string]: (
    context: Koa.ParameterizedContext<
      Koa.DefaultContext,
      Koa.Context & Route.IRouterParamContext<Koa.DefaultContext, Koa.Context>
    >,
    next: Koa.Next
  ) => any;
}

const routes: RouterMiddleware = routeSource;

for (const i of Object.keys(routes)) {
  router.use('', routes[i]);
}

export default router.routes();
