import * as Koa from 'koa';
import * as Route from 'koa-router';
import routeSource from '@/routes';

const router = new Route<Koa.DefaultContext, Koa.Context>();

interface RouterMiddleware {
  [key: string]: any;
}

const routes: RouterMiddleware = routeSource;
for (const i of Object.keys(routes)) {
  router.use('', routes[i]);
}

export default router.routes();
