import * as Koa from 'koa';
import model from '../../models/file';
class FileController {
  public async upload(ctx: Koa.Context) {
    const getFile: any = ctx.request.files;
    const fileName = getFile.t.name.replace('.zip', '');
    const name = fileName.split('_')[0];
    const version = fileName.split('_').pop();
    return await model.insertMany([
      {
        name,
        version,
        date: Date.now()
      }
    ]);
  }
  public async query(ctx: Koa.Context) {
    const params = ctx.request.body.name;
    return await model.queryByTitle(params);
  }
}

const file = new FileController();

export default file;
