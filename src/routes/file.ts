import * as Koa from 'koa';
import { Controller, Request } from '@/decorators';
import FileController from '@/controllers/file';
import '@/controllers/watcher';
@Controller('/file')
export default class File {
  @Request('/multi/upload', 'post')
  async multiUpload(ctx: Koa.Context) {
    const res = await FileController.MultiFile(ctx);
    response(ctx, res ? 200 : 500);
  }

  @Request('/single/upload', 'post')
  async singleUpload(ctx: Koa.Context) {
    const res = await FileController.SingleFile(ctx);
    response(ctx, res ? 200 : 500);
  }

  @Request('/query', 'post')
  async query(ctx: Koa.Context) {
    const res = await FileController.query(ctx);
    response(ctx, res ? 200 : 500);
  }
}
