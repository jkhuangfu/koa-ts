import * as Koa from 'koa';
import { Controller, Request, BaseRouter, RequestMethod } from '@/decorators';
import FileController from '@/controllers/file';
import '@/controllers/watcher';
@Controller('/file')
class File extends BaseRouter {
  @Request('/multi/upload', RequestMethod.POST)
  async multiUpload(ctx: Koa.Context) {
    const res = await FileController.MultiFile(ctx);
    response(ctx, res ? 200 : 500);
  }

  @Request('/single/upload', RequestMethod.POST)
  async singleUpload(ctx: Koa.Context) {
    const res = await FileController.SingleFile(ctx);
    response(ctx, res ? 200 : 500);
  }

  @Request('/query', RequestMethod.POST)
  async query(ctx: Koa.Context) {
    const res = await FileController.query(ctx);
    response(ctx, res ? 200 : 500);
  }
}

export default File.routes();
