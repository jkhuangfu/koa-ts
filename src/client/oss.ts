import * as OSS from 'ali-oss';
export default new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: '***',
  accessKeySecret: '***',
  bucket: 'oss-static-bucket'
});
