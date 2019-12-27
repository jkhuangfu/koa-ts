import * as Koa from 'koa';
import model from '../../models/file';
class fileController {
  async upload(ctx: Koa.Context) {
    const file: any = ctx.request.files;
    const fileName = file.t.name.replace('.zip', '');
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
  async query(ctx: Koa.Context) {
    const params = ctx.request.body.name;
    return await model.queryByTitle(params);
  }
}

const File = new fileController();

export default File;
