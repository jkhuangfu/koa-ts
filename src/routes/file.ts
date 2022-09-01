import * as Koa from 'koa';
import { Controller, Request } from '@/decorators';
import FileController from '@/controllers/file';
import '@/controllers/watcher';
import { response } from '@/util';
@Controller('/file')
export default class File {
  @Request('/multi/upload', 'post', { log: false })
  async multiUpload(ctx: Koa.Context) {
    const res = await FileController.MultiFile(ctx);
    response(ctx, res ? 200 : 500);
  }

  @Request('/single/upload', 'post', { log: false })
  async singleUpload(ctx: Koa.Context) {
    const res = await FileController.SingleFile(ctx);
    response(ctx, res ? 200 : 500);
  }
}
