import * as mongoose from 'mongoose';

const connString = 'mongodb://localhost:27017/test';
mongoose.connect(connString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  /*config: { autoIndex: false }*/
});

// MongoDB连接成功后回调，这里仅输出一行日志
mongoose.connection.on('connected', () => {
  LOG4.info('Mongoose 连接至 ' + connString);
});

// MongoDB连接出错后回调，这里仅输出一行日志
mongoose.connection.on('error', err => {
  LOG4.error('Mongoose connection error: ' + err);
});

// MongoDB连接断开后回调，这里仅输出一行日志
mongoose.connection.on('disconnected', () => {
  LOG4.info('Mongoose 链接断开');
});

// 当前进程退出之前关闭MongoDB连接
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    LOG4.info('Mongoose default connection closed through app termination');
    process.exit(0);
  });
});
