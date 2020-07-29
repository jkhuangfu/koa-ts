const fs = require('fs');
const path = require('path');
const srcPath = ['./src/upload', './src/views', './src/public'];
const tarPath = ['./build/src/upload', './build/src/views', './build/src/public'];
function copyFile(srcPath, tarPath, cb) {
  var rs = fs.createReadStream(srcPath);
  rs.on('error', function (err) {
    if (err) {
      console.log('read error', srcPath);
    }
    cb && cb(err);
  });

  var ws = fs.createWriteStream(tarPath);
  ws.on('error', function (err) {
    if (err) {
      console.log('write error', tarPath);
    }
    cb && cb(err);
  });
  ws.on('close', function (ex) {
    cb && cb(ex);
  });

  rs.pipe(ws);
}
function copyFolder(srcDir, tarDir, cb) {
  fs.readdir(srcDir, function (err, files) {
    var count = 0;
    var checkEnd = function () {
      ++count == files.length && cb && cb();
    };

    if (err) {
      checkEnd();
      return;
    }

    files.forEach(function (file) {
      var srcPath = path.join(srcDir, file);
      var tarPath = path.join(tarDir, file);
      fs.stat(srcPath, function (err, stats) {
        if (stats.isDirectory()) {
          // console.log('mkdir', tarPath);
          fs.mkdir(tarPath, function (err) {
            if (err) {
              console.log(1, err);
              return;
            }

            copyFolder(srcPath, tarPath, checkEnd);
          });
        } else {
          copyFile(srcPath, tarPath, checkEnd);
        }
      });
    });

    //为空时直接回调
    files.length === 0 && cb && cb();
  });
}

function work() {
  const start = Date.now();
  console.log('开始复制非ts文件');
  for (let i = 0; i < tarPath.length; i++) {
    fs.mkdirSync(tarPath[i]);
    copyFolder(srcPath[i], tarPath[i]);
  }
  console.log('复制非ts文件完成,耗时', Date.now() - start, 'ms');
}

work();
