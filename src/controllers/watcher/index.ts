import * as path from 'path';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import * as AdmZip from 'adm-zip';
let ready: boolean = false;
const WATCH_PATH: string = path.join(
  process.cwd(),
  process.env.NODE_ENV === 'development' ? '/src/upload/' : '/build/upload/'
);
// 创建上传目录
fs.exists(WATCH_PATH, exists => {
  if (!exists) fs.mkdirSync(WATCH_PATH);
});

// 检测上传目录并进行解压
chokidar
  .watch(WATCH_PATH)
  .on('add', filepath => {
    if (!ready) return;
    const ext = filepath.split('.').pop();
    const AZ = new AdmZip(filepath);
    if (ext === 'zip') {
      LOG4.http.info('解压文件');
      AZ.extractAllToAsync(WATCH_PATH, true, err => {
        if (err) return LOG4.app.error('解压出错-->', err);
        fs.unlinkSync(filepath);
      });
    }
  })
  .on('ready', () => {
    // 监听准备完毕
    ready = true;
  });
