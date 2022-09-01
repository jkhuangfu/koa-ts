import { parseString, convertableToString } from 'xml2js';
import { LOG4 } from '@/util';

// 解析XML为JSON对象
export const parseXML = (xml: convertableToString) => {
  return new Promise((resolve, reject) => {
    parseString(xml, { trim: true, explicitArray: false, ignoreAttrs: true }, (err: Error | null, result: any) => {
      if (err) {
        LOG4.app.error('解析XML失败', err);
        return reject(null);
      }
      resolve(result.xml);
    });
  });
};
