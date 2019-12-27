import * as path from 'path';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import * as AdmZip from 'adm-zip';
const watchDir = path.join(process.cwd(), '/src/upload/');
// 创建上传目录
fs.exists(watchDir, function(exists) {
  if (!exists) fs.mkdirSync(watchDir);
});

// 检测上传目录并进行解压
chokidar.watch(watchDir).on('add', filepath => {
  const ext = filepath.split('.').pop();
  const AZ = new AdmZip(filepath);
  if (ext === 'zip') {
    AZ.extractAllToAsync(watchDir, true, err => {
      if (err) return LOG4.error('解压出错-->', err);
      fs.unlinkSync(filepath);
    });
  }
});
