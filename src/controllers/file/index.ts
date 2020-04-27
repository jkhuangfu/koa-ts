import * as Koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import model from '../../models/file';
interface FileObj {
  [key: string]: any;
}

const UPLOAD_PATH: string = path.join(
  process.cwd(),
  process.env.NODE_ENV === 'development' ? '/src/upload/' : '/build/upload/'
);

class FileController {
  public async MultiFile(ctx: Koa.Context) {
    const { file } = ctx.request.files as any;
    const reader: fs.ReadStream[] = [];
    const upStream: fs.WriteStream[] = [];
    const result: boolean[] = [];
    const promise: Array<Promise<boolean>> = [];
    file.map((item: FileObj) => {
      const filePath = UPLOAD_PATH + item.name;
      reader.push(fs.createReadStream(item.path));
      upStream.push(fs.createWriteStream(filePath));
    });
    reader.map((item, idx) => {
      promise.push(
        new Promise((resolve: (value?: boolean | PromiseLike<boolean> | undefined) => void) => {
          item.pipe(upStream[idx]);
          item.on('end', () => {
            resolve(true);
          });
          item.on('error', async () => {
            resolve(false);
          });
        })
      );
    });
    const flag = await Promise.all(promise);
    if (flag.filter((item: boolean) => !item)) return true;
    return false;
  }
  public SingleFile(ctx: Koa.Context) {
    return new Promise((resolve: (value?: boolean | PromiseLike<boolean> | undefined) => void) => {
      const { file } = ctx.request.files as any;
      // 创建可读流
      const reader = fs.createReadStream(file.path);
      const filePath = UPLOAD_PATH + file.name;
      // 创建可写流
      const upStream = fs.createWriteStream(filePath);
      // 可读流通过管道写入可写流
      reader.pipe(upStream);
      reader.on('end', async () => {
        resolve(true);
      });
      reader.on('error', async () => {
        resolve(false);
      });
    });
  }
  public async query(ctx: Koa.Context) {
    const params = ctx.request.body.name;
    return await model.queryByTitle(params);
  }
}

const fileCtrl = new FileController();

export default fileCtrl;
