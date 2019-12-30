import * as path from 'path';
import * as KoaBody from 'koa-body';
const UPLOAD_PATH: string = path.join(
  process.cwd(),
  process.env.NODE_ENV === 'development' ? '/src/upload/' : '/build/upload/'
);
const bodyParse = KoaBody({
  multipart: true, // 支持文件上传
  formidable: {
    // uploadDir: UPLOAD_PATH, // 上传目录，如果设置了此项则路由不可控相关处理，
    keepExtensions: true, // 保持文件的后缀
    maxFileSize: 2 * 1024 * 1024
    // onFileBegin: (name, file) => {
    //   // 上传的文件进行重命名 这里改为上传时的原始名字
    //   file.path = UPLOAD_PATH + file.name;
    // }
  }
});
export default bodyParse;
